import { Inject, Injectable } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorieEntity } from 'src/entities';
import { Storie, Vote } from 'src/models';
import { StorieVotingDto } from 'src/dto';
import { classToPlain, deserializeArray, serialize } from 'class-transformer';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { events } from 'src/enums';

@Injectable()
export class StorieService {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
    @InjectRedis()
    private readonly redis: Redis,
    @InjectRepository(StorieEntity)
    private storieRepository: Repository<StorieEntity>,
  ) {}

  async create(gameId: string, storieName: string): Promise<Storie> {
    const createdStorie = await this.storieRepository.create({
      gameId,
      storieName,
    });

    return await this.storieRepository.save(createdStorie);
  }

  async createStories(gameId: string, stories: string[]): Promise<void> {
    const createPromise = (storie) => {
      return new Promise((resolve) => resolve(this.create(gameId, storie)));
    };

    for (const create of stories.map((storie) => () => createPromise(storie))) {
      await create();
    }
  }

  async findStoriesByGameId(gameId: string): Promise<Storie[]> {
    const stories = await this.storieRepository.find({
      where: { gameId },
      order: { created: 'ASC' },
    });

    return stories;
  }

  async findOneById(id: string): Promise<Storie> {
    return await this.storieRepository.findOne({ id });
  }

  async findUserVote(gameId: string, storieId: string, userId): Promise<Vote> {
    const redisVotes = await this.redis.get(`votes_${gameId}_${storieId}`);
    const votes = deserializeArray(Vote, redisVotes);

    return votes?.find((vote) => vote.userId === userId) ?? null;
  }

  async findVotesByGameId(gameId: string, storieId: string): Promise<Vote[]> {
    const redisVotes = await this.redis.get(`votes_${gameId}_${storieId}`);
    const storie = await this.findOneById(storieId);

    const votes = deserializeArray(Vote, redisVotes) ?? storie?.votes;
    return votes;
  }

  async resetStorieVotes(storieId: string): Promise<void> {
    const storie = await this.findOneById(storieId);

    await this.storieRepository.save({
      ...storie,
      isVoted: false,
      votes: null,
    });
  }

  updateVotes(userId: string, value: string, votes: Vote[]) {
    const voted = votes?.find((vote) => vote.userId === userId) ?? false;

    if (voted) {
      const filteredVotes = votes.filter((vote) => vote.userId !== userId);

      if (value === voted.value) {
        return filteredVotes;
      }

      votes = filteredVotes;
    }

    const vote = classToPlain({ userId, value });

    if (!votes) {
      return [vote];
    }

    return [...votes, vote];
  }

  async saveVotes(gameId: string, storieId: string): Promise<Vote[]> {
    const redisKey = `votes_${gameId}_${storieId}`;
    const storie = await this.storieRepository.findOne({
      id: storieId,
      gameId,
    });

    const votes = await this.redis.get(redisKey);

    await this.storieRepository.save({
      ...storie,
      isVoted: true,
      votes: deserializeArray(Vote, votes),
    });

    return deserializeArray(Vote, votes);
  }

  async finishVoting(gameId: string, storieId: string): Promise<Vote[]> {
    const votes = await this.saveVotes(gameId, storieId);

    await this.redis.del(`votes_${gameId}_${storieId}`);

    return votes;
  }

  async vote(
    { gameId, storieId, value }: StorieVotingDto,
    userId: string,
  ): Promise<void> {
    const { isVoted } = await this.findOneById(storieId);

    if (isVoted) {
      return;
    }

    const redisKey = `votes_${gameId}_${storieId}`;
    const redisVotes = await this.redis.get(redisKey);
    const votes = deserializeArray(Vote, redisVotes);
    const newVotes = this.updateVotes(userId, value, votes);

    await this.redis.set(redisKey, serialize(newVotes));

    const votedUserList = await this.findVotesByGameId(gameId, storieId);

    this.pubSub.publish(events.updateUserVotes, {
      updateUserVotes: {
        votes: votedUserList.map(({ userId }) => ({
          userId,
          value: null,
        })),
        gameId,
      },
    });
  }
}
