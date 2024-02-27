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
export class MedicalHistory {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  uuid: string;

  @Column()
  @Field()
  allergies: string;

  @Column()
  @Field()
  medicalConditions: string;

  @Column()
  @Field()
  surgeries: string;

  @Column()
  @Field()
  familyHistory: string;

  @Column({ nullable: true })
  @Field()
  updated_at: string;

  @Column({ nullable: true })
  @Field()
  created_at: string;

  @Column({ nullable: true })
  @Field()
  deleted_at: string;

  //MedicalHistory Table with FK patientId from PatientInformation table
  @ManyToOne(() => PatientInformation, (patient) => patient.medical_history)
  @JoinColumn({
    name: 'patientId',
  })
  patient: PatientInformation;
}
