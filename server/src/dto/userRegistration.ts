import { Field, InputType } from '@nestjs/graphql';
import { UserRoleType } from './role';

@InputType()
export class UserRegistrationDto {
  @Field()
  username: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  passwordHash?: string;

  @Field({ nullable: true })
  role?: UserRoleType;
}
