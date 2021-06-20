import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/entities';
import StorieModule from '../storie/storie.module';
import { GameResolver } from './game.resolver';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), StorieModule],
  providers: [GameResolver, GameService],
})
export default class GameModule {}
