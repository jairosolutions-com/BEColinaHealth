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
export class VitalSigns {
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
  bloodPressure: string;

  @Column()
  @Field()
  heartRate: string;

  @Column()
  @Field()
  temperature: string;

  @Column()
  @Field()
  respiratoryRate: string;

  @Column({ nullable: true })
  @Field()
  updated_at: string;

  @Column({ nullable: true })
  @Field()
  created_at: string;

  @Column({ nullable: true })
  @Field()
  deleted_at: string;

  //vital_signs Table with FK patientId from PatientInformation table
  @ManyToOne(() => PatientInformation, (patient) => patient.vital_signs)
  @JoinColumn({
    name: 'patientId',
  })
  patient: PatientInformation;
}
