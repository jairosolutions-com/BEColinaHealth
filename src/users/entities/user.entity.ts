import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Company } from 'src/company/entities/company.entity';
import { UserAccessLevel } from 'src/user_access_level/entities/user_access_level.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Users {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  Id: number;

  @Column()
  @Field()
  uuid: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column()
  @Field()
  fName: string;

  @Column()
  @Field()
  lName: string;

  @Column()
  @Field()
  status: string;

  @Column({ nullable: true })
  @Field()
  updated_at: string;

  @Column({ nullable: true })
  @Field()
  created_at: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Field()
  deleted_at: string;

  //Patient Information with FK patientId from Company table
  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({
    name: 'companyId',
  })
  company: Company;

  @ManyToOne(() => UserAccessLevel, (ual) => ual.users)
  @Field(() => [UserAccessLevel], { nullable: true })
  ual: UserAccessLevel[];
}
