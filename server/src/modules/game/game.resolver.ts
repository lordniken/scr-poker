import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Resolver,
  Query,
  Subscription,
} from '@nestjs/graphql';
import { GameCreateDto, GameVotingDto } from 'src/dto';
import { Game, GameInfo, UserCredentials } from 'src/models';
import { GameService } from './game.service';
import { AuthGuard } from '../auth/auth.guard';
import { PubSubEngine } from 'graphql-subscriptions';
import { events } from 'src/enums';
import { GameStatus } from 'src/models/GameStatus';

@Resolver(() => Boolean)
@UseGuards(new AuthGuard())
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {}

  @Mutation(() => Game)
  async createGame(
    @Context('user') user: UserCredentials,
    @Args('data') data: GameCreateDto,
  ): Promise<Game> {
    const newGame = await this.gameService.create(data, user);

    return newGame;
  }

  @Query(() => GameInfo)
  async gameInfo(
    @Context('user') user: UserCredentials,
    @Args('gameId') gameId: string,
  ): Promise<GameInfo> {
    const gameInfo = await this.gameService.getGameInfo(gameId, user);

    return gameInfo;
  }

  @Mutation(() => Boolean)
  async changeGameStatus(
    @Context('user') { id: userId }: UserCredentials,
    @Args('data') { gameId, storieId }: GameVotingDto,
  ): Promise<boolean> {
    const result = await this.gameService.changeGameStatus(
      gameId,
      storieId,
      userId,
    );

    this.pubSub.publish(events.gameStatusChanged, {
      gameStatusChanged: result,
    });

    return true;
  }

  @Subscription(() => GameStatus)
  gameStatusChanged() {
    return this.pubSub.asyncIterator(events.gameStatusChanged);
  }
}
