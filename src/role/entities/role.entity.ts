import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserAccessLevel } from 'src/user_access_level/entities/user_access_level.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

  @OneToMany(() => UserAccessLevel, (ual) => ual.users)
  @Field(() => [UserAccessLevel], { nullable: true })
  ual: UserAccessLevel[];
}
