import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserAuthDto {
  @Field()
  email: string;

  @Field()
  passwordHash: string;
}
