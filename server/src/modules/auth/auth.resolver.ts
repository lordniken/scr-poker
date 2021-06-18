import { Args, Resolver, Query } from '@nestjs/graphql';
import { UserAuthDto } from 'src/dto';
import { User } from 'src/models';
import { AuthService } from './auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  async auth(@Args('data') data: UserAuthDto): Promise<any> {
    const user = await this.authService.checkAuth(data);

    return this.authService.createToken(user);
  }
}
