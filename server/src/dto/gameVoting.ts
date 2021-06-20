import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GameVotingDto {
  @Field()
  gameId: string;

  @Field()
  storieId: string;
}
