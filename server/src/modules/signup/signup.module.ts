import { Module } from '@nestjs/common';
import AuthModule from '../auth/auth.module';
import UserModule from '../user/user.module';
import { SignupResolver } from './signup.resolver';
import { SignupService } from './signup.service';

@Module({
  imports: [UserModule, AuthModule],
  providers: [SignupResolver, SignupService],
})
export default class SignupModule {}
