import { Module } from '@nestjs/common';
import AuthModule from '../auth/auth.module';
import { OnlineResolver } from './online.resolver';
import { OnlineService } from './online.service';

@Module({
  imports: [AuthModule],
  providers: [OnlineResolver, OnlineService],
  exports: [OnlineService],
})
export default class OnlineModule {}
