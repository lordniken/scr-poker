import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/entities';
import StorieModule from '../storie/storie.module';
import UserModule from '../user/user.module';
import { GameResolver } from './game.resolver';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), StorieModule, UserModule],
  providers: [GameResolver, GameService],
})
export default class GameModule {}
