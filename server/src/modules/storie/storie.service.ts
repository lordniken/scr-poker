import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorieEntity } from 'src/entities';
import { Storie, Vote } from 'src/models';
import { StorieVotingDto } from 'src/dto';
import { classToPlain, deserializeArray, serialize } from 'class-transformer';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class StorieService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    @InjectRepository(StorieEntity)
    private storieRepository: Repository<StorieEntity>,
  ) {}

  async create(gameId: string, storieName: string): Promise<Storie> {
    const newGameQuery = await this.storieRepository.create({
      gameId,
      storieName,
    });

    return await this.storieRepository.save(newGameQuery);
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

  async findVoteByUserId(gameId: string, id: string, userId): Promise<Vote> {
    const redisVotes = await this.redis.get(`votes_${gameId}_${id}`);
    const votes = deserializeArray(Vote, redisVotes);

    return votes?.find((vote) => vote.userId === userId) ?? null;
  }

  async findVotesByGameId(gameId: string, storieId: string): Promise<Vote[]> {
    const redisVotes = await this.redis.get(`votes_${gameId}_${storieId}`);
    const storie = await this.findOneById(storieId);

    const votes = deserializeArray(Vote, redisVotes) ?? storie?.votes;
    return votes;
  }

  makeNewVotes(userId: string, value: string, votes: Vote[]) {
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
    const redisKey = `votes_${gameId}_${storieId}`;
    const redisVotes = await this.redis.get(redisKey);
    const votes = deserializeArray(Vote, redisVotes);
    const newVotes = this.makeNewVotes(userId, value, votes);

    await this.redis.set(redisKey, serialize(newVotes));
  }
}
