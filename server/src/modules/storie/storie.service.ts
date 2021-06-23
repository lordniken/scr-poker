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
    const stories = await this.storieRepository.find({ gameId });

    return stories;
  }

  async findOneById(id: string): Promise<Storie> {
    return await this.storieRepository.findOne({ id });
  }

  async fineOne(gameId: string, id: string): Promise<Storie> {
    return await this.storieRepository.findOne({ gameId, id });
  }

  async findVoteByUserId(gameId: string, id: string, userId): Promise<Vote> {
    const redisVotes = await this.redis.get(`votes_${gameId}_${id}`);
    const votes = deserializeArray(Vote, redisVotes);

    return votes?.find((vote) => vote.userId === userId) ?? null;
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

  async vote(
    { gameId, storieId, value }: StorieVotingDto,
    userId: string,
  ): Promise<void> {
    const redisKey = `votes_${gameId}_${storieId}`;
    const redisVotes = await this.redis.get(redisKey);
    const votes = deserializeArray(Vote, redisVotes);
    const newVotes = this.makeNewVotes(userId, value, votes);
    console.log('newVotes', newVotes);
    await this.redis.set(redisKey, serialize(newVotes));
  }
}
