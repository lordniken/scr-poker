import { Entity, Column } from 'typeorm';
import { UserRoleType } from 'src/enums';
import { Base } from 'src/entities/base';

@Entity('users')
export class UserEntity extends Base {
  @Column({ type: 'varchar', length: 30 })
  username: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  role: UserRoleType;
}
