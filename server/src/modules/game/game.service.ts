import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEntity } from 'src/entities';
import { GameCreateDto } from 'src/dto';
import { NewGame } from 'src/models';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private gamesRepository: Repository<GameEntity>,
  ) {}

  async create(data: GameCreateDto, ownerId: string): Promise<NewGame> {
    const newGameQuery = await this.gamesRepository.create({
      ownerId,
      ...data,
    });
    const newGame = await this.gamesRepository.save(newGameQuery);

    return newGame;
  }
}
