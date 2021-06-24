import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { Game } from './Game';

@ObjectType()
export class GameInfo extends Game {
  @Expose()
  @Field()
  isGameOwner?: boolean;

  @Expose()
  @Field({ nullable: true })
  votedScore: string;

  @Expose()
  @Field(() => [String], { nullable: true })
  onlineList: string[];
}
