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
export class Medication {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  uuid: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  medicationDate: Date;

  @Column()
  @Field()
  comments: string;

  @Column()
  @Field()
  medicationStatus: string;

  @Column({ nullable: true })
  @Field()
  updated_at: string;

  @Column({ nullable: true })
  @Field()
  created_at: string;

  @Column({ nullable: true })
  @Field()
  deleted_at: string;

  //Medication Table with FK patientId from PatientInformation table
  @ManyToOne(() => PatientInformation, (patient) => patient.medications)
  @JoinColumn({
    name: 'patientId',
  })
  patient: PatientInformation;
}
