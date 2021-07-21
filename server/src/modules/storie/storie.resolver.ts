import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Resolver,
  Query,
  Mutation,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { StorieVotingDto } from 'src/dto';
import { events } from 'src/enums';
import { Storie, User, Vote } from 'src/models';
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

    const votedUserList = await this.storieService.findVotesByGameId(
      data.gameId,
      data.storieId,
    );

    this.pubSub.publish(events.updateUserVotes, {
      updateUserVotes: {
        votes: votedUserList.map(({ userId }) => ({
          userId,
          value: null,
        })),
        gameId: data.gameId,
      },
    });

    return true;
  }

  @Subscription(() => [Vote], {
    filter: ({ updateUserVotes }, { gameId }) => {
      return updateUserVotes.gameId === gameId;
    },
    resolve: ({ updateUserVotes }) => {
      return updateUserVotes.votes;
    },
  })
  updateUserVotes(@Args('gameId') _gameId: string) {
    return this.pubSub.asyncIterator(events.updateUserVotes);
  }
}
