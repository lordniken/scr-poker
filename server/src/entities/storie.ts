import { Entity, Column } from 'typeorm';
import { Base } from 'src/entities/base';

@Entity('stories')
export class StorieEntity extends Base {
  @Column('text')
  gameId: string;

  @Column({ type: 'varchar', length: 200 })
  storieName: string;
}
