import { Inject, UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Mutation, Subscription } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { Storie } from 'src/models';
import { AuthGuard } from '../auth/auth.guard';
import { StorieService } from './storie.service';

@Resolver(() => Boolean)
@UseGuards(new AuthGuard())
export class StorieResolver {
  constructor(
    private readonly storieService: StorieService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {}

  @Query(() => [Storie])
  async stories(@Args('gameId') gameId: string): Promise<Storie[]> {
    const stories = await this.storieService.findStoriesByGameId(gameId);

    return stories;
  }

  @Mutation(() => Boolean)
  async startRound(@Args('id') id: string): Promise<boolean> {
    await this.storieService.startStorieVote(id);

    return true;
  }

  @Subscription((returns) => String)
  commentAdded() {
    return this.pubSub.asyncIterator('commentAdded');
  }

  @Mutation((returns) => String)
  test() {
    this.pubSub.publish('commentAdded', { commentAdded: 'asd' });

    return 'asd';
  }
}
