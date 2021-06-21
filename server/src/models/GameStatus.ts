import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class GameStatus {
  @Expose()
  @Field()
  isVotingStarted: boolean;

  @Expose()
  @Field({ nullable: true })
  votingStorieId: string;
}
