import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { PubSubEngine } from 'graphql-subscriptions';
import { events } from 'src/enums';
import { GameEntity } from 'src/entities';
import { GameCreateDto } from 'src/dto';
import { Game, GameInfo, User, UserCredentials, Vote } from 'src/models';
import { GameStatus } from 'src/models/GameStatus';
import { replaceValues } from 'src/utils/filters';
import { StorieService } from '../storie/storie.service';
import { OnlineService } from '../online/online.service';

@Injectable()
export class GameService {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
    @InjectRepository(GameEntity)
    private gamesRepository: Repository<GameEntity>,
    private readonly storieService: StorieService,
    private readonly onlineService: OnlineService,
  ) {}

  async create(data: GameCreateDto, user: UserCredentials): Promise<Game> {
    const newGameQuery = await this.gamesRepository.create({
      ...data,
      ownerId: user.id,
    });
    const newGame = await this.gamesRepository.save(newGameQuery);

    await this.storieService.createStories(newGame.id, data.stories);

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

  async getGameInfo(gameId: string, user: User): Promise<GameInfo> {
    const game = await this.findGameById(gameId);
    const isGameOwner = user.id === game.ownerId;
    const userVote = await this.storieService.findVoteByUserId(
      gameId,
      game.status.votingStorieId,
      user.id,
    );
    const votedScore = userVote?.value;
    const gameStatus = await this.getGameStatus(game);

    await this.onlineService.addUser(gameId, user);
    const onlineList = await this.onlineService.getOnlineList(gameId);

    this.pubSub.publish(events.updateOnlineList, {
      gameId,
      onlineList,
    });

    return plainToClass(GameInfo, {
      ...game,
      ...gameStatus,
      votedScore,
      isGameOwner,
    });
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
