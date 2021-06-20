import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Query } from '@nestjs/graphql';
import { Storie } from 'src/models';
import { AuthGuard } from '../auth/auth.guard';
import { StorieService } from './storie.service';

@Resolver(() => Boolean)
@UseGuards(new AuthGuard())
export class StorieResolver {
  constructor(private readonly storieService: StorieService) {}

  @Query(() => [Storie])
  async stories(@Args('gameId') gameId: string): Promise<Storie[]> {
    const stories = await this.storieService.findStoriesByGameId(gameId);

    return stories;
  }
}
