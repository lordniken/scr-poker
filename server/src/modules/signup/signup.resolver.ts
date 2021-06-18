import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRegistrationDto } from 'src/dto';
import { AuthService } from '../auth/auth.service';
import { SignupService } from './signup.service';

@Resolver(() => Boolean)
export class SignupResolver {
  constructor(
    private readonly signupService: SignupService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => String)
  async createUser(@Args('data') data: UserRegistrationDto): Promise<string> {
    const user = await this.signupService.createUser(data);
    const userToken = this.authService.createToken(user, '180d');

    return userToken;
  }
}
