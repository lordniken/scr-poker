import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { Base } from './Base';

@ObjectType()
export class User extends Base {
  @Expose()
  @Field({ nullable: true })
  username: string;

  @Expose()
  @Field({ nullable: true })
  email: string;

  @Expose()
  @Field({ nullable: true })
  role: string;
}
