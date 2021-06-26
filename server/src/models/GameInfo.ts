import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { Game } from './Game';
import { User } from './User';

@ObjectType()
export class GameInfo extends Game {
  @Expose()
  @Field()
  isGameOwner?: boolean;

  @Expose()
  @Field({ nullable: true })
  votedScore: string;

  @Expose()
  @Field(() => [User], { nullable: true })
  onlineList: User[];
}
