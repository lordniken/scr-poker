import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { deserializeArray, plainToClass, serialize } from 'class-transformer';
import { GameEntity } from 'src/entities';
import { GameCreateDto } from 'src/dto';
import { Game, GameInfo, User, Vote } from 'src/models';
import { GameStatus } from 'src/models/GameStatus';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { UserService } from '../user/user.service';
import { StorieService } from '../storie/storie.service';
import { replaceValues } from 'src/utils/filters';

@Injectable()
export class GameService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    @InjectRepository(GameEntity)
    private gamesRepository: Repository<GameEntity>,
    private readonly userService: UserService,
    private readonly storieService: StorieService,
  ) {}

  async create(data: GameCreateDto, ownerId: string): Promise<Game> {
    const newGameQuery = await this.gamesRepository.create({
      ...data,
      ownerId,
    });
    const newGame = await this.gamesRepository.save(newGameQuery);

    await this.storieService.createStories(newGame.id, data.stories);
    await this.updateOnlineList(newGame.id, ownerId);

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

  sortVotesByValue(votes: Vote[]): Vote[] {
    const nomalizedVotes = replaceValues(
      votes,
      'value',
      ['½', '?'],
      ['0.5', 'Infinity'],
    );

    const sortedNomalizedVotes = nomalizedVotes?.sort((a, b) => {
      return a.value - b.value;
    });

    const sortedVotes = replaceValues(
      sortedNomalizedVotes,
      'value',
      ['0.5', 'Infinity'],
      ['½', '?'],
    );

    return sortedVotes as Vote[];
  }

  async getGameStatus(game: Game): Promise<GameStatus> {
    const votes = await this.storieService.findVotesByGameId(
      game.id,
      game.status.votingStorieId,
    );

    const sortedVotes = this.sortVotesByValue(votes);

    return plainToClass(GameStatus, {
      ...game.status,
      votedUsers: sortedVotes?.map((user) => ({
        ...user,
        value: game.status.isVotingStarted ? null : user.value,
      })),
    });
  }

  async getGameInfo(gameId: string, userId: string): Promise<GameInfo> {
    const game = await this.findGameById(gameId);
    const isGameOwner = userId === game.ownerId;
    const userVote = await this.storieService.findVoteByUserId(
      gameId,
      game.status.votingStorieId,
      userId,
    );
    const votedScore = userVote?.value;

    const onlineUsers = await this.updateOnlineList(gameId, userId);
    const onlineList = onlineUsers?.map(({ id, username }) => ({
      id,
      username,
    }));
    const gameStatus = await this.getGameStatus(game);

    return plainToClass(GameInfo, {
      ...game,
      ...gameStatus,
      votedScore,
      onlineList,
      isGameOwner,
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

    return userList;
  }

  async changeGameStatus(gameId, storieId, userId): Promise<GameStatus> {
    const game = await this.findGameById(gameId);
    let votes = null;

    if (game.ownerId !== userId) {
      return;
    }

    if (game.status.isVotingStarted) {
      const gameVotes = await this.storieService.finishVoting(
        gameId,
        game.status.votingStorieId,
      );
      votes = this.sortVotesByValue(gameVotes);
    }

    const savedGame = await this.gamesRepository.save({
      ...game,
      votingStorieId: storieId,
      isVotingStarted: !game.status.isVotingStarted,
    });

    return plainToClass(
      GameStatus,
      {
        ...savedGame,
        votedUsers: votes,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
