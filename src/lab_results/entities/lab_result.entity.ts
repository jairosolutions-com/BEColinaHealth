import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PatientInformation } from 'src/patient_information/entities/patient_information.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class LabResults {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  uuid: string;

  @Column()
  date: string;

  @Column()
  hemoglobinA1c: string;

  @Column()
  fastingBloodGlucose: string;

  @Column()
  totalCholesterol: string;

  @Column()
  ldlCholesterol: string;

  @Column()
  hdlCholesterol: string;

  @Column()
  triglycerides: string;

  @Column()
  @Field((type) => Int)
  patientId: number;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  @Field()
  updated_at: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  @Field()
  created_at: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Field()
  deleted_at: string;


  //LabResults Table with FK patientId from PatientInformation table
  @ManyToOne(() => PatientInformation, (patient) => patient.lab_results)
  @JoinColumn({
    name: 'patientId',
  })
  patient: PatientInformation;
}
