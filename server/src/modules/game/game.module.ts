import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/entities';
import { GameResolver } from './game.resolver';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity])],
  providers: [GameResolver, GameService],
})
export default class GameModule {}
