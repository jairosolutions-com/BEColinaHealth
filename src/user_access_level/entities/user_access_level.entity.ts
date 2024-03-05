import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import { Users } from 'src/users/entities/user.entity';

@Entity()
export class UserAccessLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (users) => users.ual, { nullable: true })
  @JoinColumn({
    name: 'userId',
  })
  users: Users | null;

  @ManyToOne(() => Role, (role) => role.ual, { nullable: true })
  @JoinColumn({
    name: 'roleId',
  })
  role: Role | null;
}
