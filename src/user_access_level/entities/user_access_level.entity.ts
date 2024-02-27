import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from 'src/role/entities/role.entity';
import { Users } from 'src/users/entities/user.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class UserAccessLevel {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  userId: number;

  @Column()
  @Field(() => Int)
  roleId: number;

  @OneToMany(() => Users, (users) => users.ual)
  @JoinColumn({
    name: 'userId',
  })
  users: Users;

  @ManyToOne(() => Role, (role) => role.ual)
  @JoinColumn({
    name: 'roleId',
  })
  role: Role;
}
