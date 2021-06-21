import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { GameEntity } from 'src/entities';
import { GameCreateDto, GameVotingDto } from 'src/dto';
import { Game } from 'src/models';
import { GameStatus } from 'src/models/GameStatus';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private gamesRepository: Repository<GameEntity>,
  ) {}

  async create(data: GameCreateDto, ownerId: string): Promise<Game> {
    const newGameQuery = await this.gamesRepository.create({
      ...data,
      ownerId,
    });
    const newGame = await this.gamesRepository.save(newGameQuery);

    return plainToClass(Game, newGame, {
      excludeExtraneousValues: true,
    });
  }

  async findGameById(id: string): Promise<Game> {
    const game = await this.gamesRepository.findOne({ id });

    return plainToClass(Game, game, {
      excludeExtraneousValues: true,
    });
  }

  async changeGameStatus({
    gameId,
    storieId,
  }: GameVotingDto): Promise<GameStatus> {
    const game = await this.findGameById(gameId);

    if (game.status.isVotingStarted) {
      storieId = null;
    }

    const savedGame = await this.gamesRepository.save({
      ...game,
      votingStorieId: storieId,
      isVotingStarted: !!storieId,
    });

    return plainToClass(GameStatus, savedGame, {
      excludeExtraneousValues: true,
    });
  }
}
