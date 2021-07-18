import { Inject } from '@nestjs/common';
import { Args, Resolver, Query, Subscription } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { events } from 'src/enums';
import { UserCredentials } from 'src/models';
import { OnlineService } from './online.service';

@Resolver(() => Boolean)
export class OnlineResolver {
  constructor(
    private readonly onlineService: OnlineService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {}

  @Query(() => [UserCredentials])
  async onlineList(@Args('gameId') gameId: string): Promise<UserCredentials[]> {
    const onlineList = await this.onlineService.getOnlineList(gameId);

    return onlineList;
  }

  @Subscription(() => [UserCredentials], {
    filter: (payload, { gameId }) => {
      return payload.gameId === gameId;
    },
    resolve: ({ onlineList }) => {
      return onlineList;
    },
  })
  updateOnlineList(@Args('gameId') _gameId: string) {
    return this.pubSub.asyncIterator(events.updateOnlineList);
  }
}
