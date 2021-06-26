import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { Vote } from './Vote';

@ObjectType()
export class GameStatus {
  @Expose()
  @Field()
  isVotingStarted?: boolean;

  @Expose()
  @Field({ nullable: true })
  votingStorieId?: string;

  @Expose()
  @Field(() => [Vote], { nullable: true })
  votedUsers: Vote[];
}
