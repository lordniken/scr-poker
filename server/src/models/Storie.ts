import { Field, ObjectType } from '@nestjs/graphql';
import { Expose, plainToClass, Transform } from 'class-transformer';
import { Base } from './Base';
import { Vote } from './Vote';

@ObjectType()
export class Storie extends Base {
  @Expose()
  @Field()
  storieName: string;

  @Expose()
  @Field()
  isVoted: boolean;

  @Expose()
  @Transform(({ obj }) => {
    /*
    plainToClass(Vote, obj, {
      excludeExtraneousValues: true,
    }),
    */
    return null;
  })
  @Field(() => [Vote], { nullable: true })
  votes: Vote[];
}
