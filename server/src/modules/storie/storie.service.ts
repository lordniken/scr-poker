import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorieEntity } from 'src/entities';
import { Storie } from 'src/models';

@Injectable()
export class StorieService {
  constructor(
    @InjectRepository(StorieEntity)
    private storieRepository: Repository<StorieEntity>,
  ) {}

  async create(gameId: string, storieName: string): Promise<Storie> {
    const newGameQuery = await this.storieRepository.create({
      gameId,
      storieName,
    });

    return await this.storieRepository.save(newGameQuery);
  }

  async findStoriesByGameId(gameId: string): Promise<Storie[]> {
    const stories = await this.storieRepository.find({ gameId });

    return stories;
  }
}
