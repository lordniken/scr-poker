import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/models';
import { AuthGuard } from '../auth/auth.guard';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  @UseGuards(new AuthGuard())
  async me(@Context('user') { id, username }: User): Promise<User> {
    return { id, username };
  }
}
