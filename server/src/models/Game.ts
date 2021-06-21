import { Field, ObjectType } from '@nestjs/graphql';
import { Expose, plainToClass, Transform } from 'class-transformer';
import { GameVotingSystemType } from 'src/enums';
import { Base } from './Base';
import { GameStatus } from './GameStatus';

@ObjectType()
export class Game extends Base {
  @Expose()
  @Field()
  id: string;

  @Expose()
  @Field()
  gameName: string;

  @Expose()
  @Field()
  votingSystem: GameVotingSystemType;

  @Expose()
  @Field()
  allowSpectators: boolean;

  @Expose()
  @Transform(({ obj }) =>
    plainToClass(GameStatus, obj, {
      excludeExtraneousValues: true,
    }),
  )
  @Field()
  status: GameStatus;

  @Expose()
  @Field()
  ownerId: string;
}
