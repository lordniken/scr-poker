import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class Vote {
  @Expose()
  @Field()
  userId: string;

  @Expose()
  @Field()
  value: string;
}
