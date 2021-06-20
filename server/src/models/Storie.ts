import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { Base } from './Base';

@ObjectType()
export class Storie extends Base {
  @Expose()
  @Field()
  storieName: string;

  @Expose()
  @Field()
  isVoted: boolean;
}
