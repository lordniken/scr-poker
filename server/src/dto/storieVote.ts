import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StorieVotingDto {
  @Field()
  gameId: string;

  @Field()
  storieId: string;

  @Field({ nullable: true })
  value: string;
}
