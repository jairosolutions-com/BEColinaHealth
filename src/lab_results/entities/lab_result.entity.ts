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
export class LabResults {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  uuid: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  date: Date;

  @Column()
  @Field()
  hemoglobinA1c: string;

  @Column()
  @Field()
  fastingBloodGlucose: string;

  @Column()
  @Field()
  totalCholesterol: string;

  @Column()
  @Field()
  ldlCholesterol: string;

  @Column()
  @Field()
  hdlCholesterol: string;

  @Column()
  @Field()
  triglycerides: string;

  @Column({ nullable: true })
  @Field()
  updated_at: string;

  @Column({ nullable: true })
  @Field()
  created_at: string;

  @Column({ nullable: true })
  @Field()
  deleted_at: string;

  //LabResults Table with FK patientId from PatientInformation table
  @ManyToOne(() => PatientInformation, (patient) => patient.lab_results)
  @JoinColumn({
    name: 'patientId',
  })
  patient: PatientInformation;
}
