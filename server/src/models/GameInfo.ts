import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { Game } from './Game';

@ObjectType()
export class GameInfo extends Game {
  @Expose()
  @Field()
  isGameOwner?: boolean;
}
