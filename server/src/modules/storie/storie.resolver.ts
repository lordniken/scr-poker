import { Inject, UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { StorieVotingDto } from 'src/dto';
import { Storie, User } from 'src/models';
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
  async vote(
    @Context('user') { id: userId }: User,
    @Args('data') data: StorieVotingDto,
  ): Promise<boolean> {
    await this.storieService.vote(data, userId);

    return true;
  }
}
