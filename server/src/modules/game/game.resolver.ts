import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GameCreateDto } from 'src/dto';
import { Game, GameInfo, User } from 'src/models';
import { GameService } from './game.service';
import { AuthGuard } from '../auth/auth.guard';

@Resolver(() => Boolean)
@UseGuards(new AuthGuard())
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Mutation(() => Game)
  async createGame(
    @Context('user') { id: userId }: User,
    @Args('data') data: GameCreateDto,
  ): Promise<Game> {
    const newGame = await this.gameService.create(data, userId);

    return newGame;
  }

  @Query(() => GameInfo)
  async gameInfo(
    @Context('user') { id: userId }: User,
    @Args('gameId') gameId: string,
  ): Promise<GameInfo> {
    const gameInfo = await this.gameService.findGameById(gameId, userId);

    return gameInfo;
  }
}
