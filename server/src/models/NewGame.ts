import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { GameVotingSystemType } from 'src/enums';
import { Base } from './Base';

@ObjectType()
export class NewGame extends Base {
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
  @Field(() => [String])
  stories: string[];
}
