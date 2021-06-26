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
import { Game, GameInfo, User } from 'src/models';
import { GameService } from './game.service';
import { AuthGuard } from '../auth/auth.guard';
import { StorieService } from '../storie/storie.service';
import { PubSubEngine } from 'graphql-subscriptions';
import { events } from 'src/enums';
import { GameStatus } from 'src/models/GameStatus';
import { UserService } from '../user/user.service';

@Resolver(() => Boolean)
@UseGuards(new AuthGuard())
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly storieService: StorieService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {}

  @Mutation(() => Game)
  async createGame(
    @Context('user') { id: userId }: User,
    @Args('data') data: GameCreateDto,
  ): Promise<Game> {
    const newGame = await this.gameService.create(data, userId);

    await Promise.all(
      data.stories.map((storie) =>
        this.storieService.create(newGame.id, storie),
      ),
    );

    return newGame;
  }

  @Query(() => GameInfo)
  async gameInfo(
    @Context('user') { id: userId }: User,
    @Args('gameId') gameId: string,
  ): Promise<GameInfo> {
    const game = await this.gameService.findGameById(gameId);
    const vote = await this.storieService.findVoteByUserId(
      gameId,
      game.status.votingStorieId,
      userId,
    );
    const votedScore = vote?.value;
    const onlineList = await this.gameService.updateOnlineList(gameId, userId);
    const { id, username } = await this.userService.findUserById(userId);

    this.pubSub.publish(events.userJoined, {
      userJoined: { id, username },
    });

    return {
      ...game,
      isGameOwner: userId === game.ownerId,
      votedScore,
      onlineList,
    };
  }

  @Mutation(() => Boolean)
  async changeGameStatus(@Args('data') data: GameVotingDto): Promise<boolean> {
    const result = await this.gameService.changeGameStatus(data);

    this.pubSub.publish(events.gameStatusChanged, {
      gameStatusChanged: result,
    });

    return true;
  }

  @Subscription(() => GameStatus)
  gameStatusChanged() {
    return this.pubSub.asyncIterator(events.gameStatusChanged);
  }

  @Subscription(() => User)
  userJoined() {
    return this.pubSub.asyncIterator(events.userJoined);
  }

  @Subscription(() => String)
  userDisconnected() {
    return this.pubSub.asyncIterator(events.userDisconnected);
  }
}
