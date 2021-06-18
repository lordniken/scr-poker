import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/models';
import { UserEntity } from 'src/entities';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(new AuthGuard())
  async me(@Context('user') { id }: User): Promise<User> {
    return this.userService.findUser({ id } as UserEntity);
  }
}
