import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class UserCredentials {
  @Expose()
  @Field(() => ID)
  id: string;

  @Expose()
  @Field()
  username: string;
}
