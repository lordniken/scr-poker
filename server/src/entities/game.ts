import { Entity, Column } from 'typeorm';
import { GameVotingSystemType } from 'src/enums';
import { Base } from 'src/entities/base';

@Entity('games')
export class GameEntity extends Base {
  @Column('text')
  ownerId: string;

  @Column({ type: 'varchar', length: 100 })
  gameName: string;

  @Column('text')
  votingSystem: GameVotingSystemType;

  @Column({ type: 'boolean' })
  allowSpectators: boolean;
}
