import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from 'src/roles/entities/roles.entity';
import { Users } from 'src/users/entities/users.entity';

@Entity('userAccessLevels')
export class UserAccessLevels {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (users) => users.ual, { nullable: true })
  @JoinColumn({
    name: 'userId',
  })
  users: Users | null;

  @ManyToOne(() => Roles, (roles) => roles.ual, { nullable: true })
  @JoinColumn({
    name: 'rolesId',
  })
  roles: Roles | null;
}
