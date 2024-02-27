import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PatientInformation } from 'src/patient_information/entities/patient_information.entity';
import { Users } from 'src/users/entities/user.entity';

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Company {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  uuid: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  contactNo: string;

  @Column()
  @Field()
  website: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  state: string;

  @Column()
  @Field()
  zip: string;

  @Column({ nullable: true })
  @Field()
  updated_at: string;

  @Column({ nullable: true })
  @Field()
  created_at: string;

  @Column({ nullable: true })
  @Field()
  deleted_at: string;

  @OneToMany(() => PatientInformation, (patient) => patient.company)
  @Field(() => [PatientInformation], { nullable: true })
  patient: PatientInformation[];

  @OneToMany(() => Users, (users) => users.company)
  @Field(() => [Users], { nullable: true })
  users: Users[];
}
