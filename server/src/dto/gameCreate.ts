import { Field, InputType } from '@nestjs/graphql';
import { GameVotingSystemType } from '../enums';

@InputType()
export class GameCreateDto {
  @Field()
  gameName: string;

  @Field()
  votingSystem: GameVotingSystemType;

  @Field()
  allowSpectators: boolean;

  @Field(() => [String])
  stories: string[];
}
