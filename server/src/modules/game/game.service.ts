import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { deserializeArray, plainToClass, serialize } from 'class-transformer';
import { GameEntity } from 'src/entities';
import { GameCreateDto, GameVotingDto } from 'src/dto';
import { Game, User } from 'src/models';
import { GameStatus } from 'src/models/GameStatus';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { UserService } from '../user/user.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    @InjectRepository(GameEntity)
    private gamesRepository: Repository<GameEntity>,
    private readonly userService: UserService,
  ) {}

  async create(data: GameCreateDto, ownerId: string): Promise<Game> {
    const newGameQuery = await this.gamesRepository.create({
      ...data,
      ownerId,
    });
    const newGame = await this.gamesRepository.save(newGameQuery);
    this.updateOnlineList(newGame.id, ownerId);

    return plainToClass(Game, newGame, {
      excludeExtraneousValues: true,
    });
  }

  async findGameById(id: string): Promise<Game> {
    const game = await this.gamesRepository.findOne({ id });

    return plainToClass(Game, game, {
      excludeExtraneousValues: true,
    });
  }

  async updateOnlineList(gameId: string, userId: string): Promise<User[]> {
    const redisKey = `online_${gameId}`;
    const redisOnlineList = await this.redis.get(redisKey);

    if (!redisOnlineList) {
      await this.redis.set(redisKey, serialize([userId]));
      return;
    }

    const onlineList = deserializeArray(String, redisOnlineList);
    const newOnlineList = new Set([...onlineList, userId]);

    await this.redis.set(redisKey, serialize(newOnlineList));

    const userList = await Promise.all(
      [...newOnlineList].map((user: string) =>
        this.userService.findUserById(user),
      ),
    );

    return userList.map((user) => ({
      id: user.id,
      username: user.username,
    }));
  }

  async changeGameStatus({
    gameId,
    storieId,
  }: GameVotingDto): Promise<GameStatus> {
    const game = await this.findGameById(gameId);

    if (game.status.isVotingStarted) {
      storieId = null;
    }

    const savedGame = await this.gamesRepository.save({
      ...game,
      votingStorieId: storieId,
      isVotingStarted: !!storieId,
    });

    return plainToClass(GameStatus, savedGame, {
      excludeExtraneousValues: true,
    });
  }
}
