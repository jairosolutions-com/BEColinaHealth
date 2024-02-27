import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PatientInformation } from 'src/patient_information/entities/patient_information.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class EmergencyContact {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  uuid: string;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column()
  @Field()
  phoneNumber: string;

  @Column()
  @Field()
  patientRelationship: string;

  @Column()
  @Field()
  city: string;

  @Column()
  @Field()
  state: string;

  @Column()
  @Field()
  zip: string;

  @Column()
  @Field()
  country: string;

  @Column({ nullable: true })
  @Field()
  updated_at: string;

  @Column({ nullable: true })
  @Field()
  created_at: string;

  @Column({ nullable: true })
  @Field()
  deleted_at: string;

  //Emergency Contact Table with FK patientId from PatientInformation table
  @ManyToOne(() => PatientInformation, (patient) => patient.emergency_contact)
  @JoinColumn({
    name: 'patientId',
  })
  patient: PatientInformation;
}
