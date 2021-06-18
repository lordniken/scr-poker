import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class Base {
  @Expose()
  @Field(() => ID)
  id: string;

  @Expose()
  @Field()
  created: Date;

  @Expose()
  @Field()
  updated: Date;
}
