import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GameCreateDto } from 'src/dto';
import { NewGame, User } from 'src/models';
import { GameService } from './game.service';
import { AuthGuard } from '../auth/auth.guard';

@Resolver(() => Boolean)
@UseGuards(new AuthGuard())
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Mutation(() => NewGame)
  async createGame(
    @Context('user') { id: userId }: User,
    @Args('data') data: GameCreateDto,
  ): Promise<NewGame> {
    const newGame = await this.gameService.create(data, userId);

    return newGame;
  }
}
