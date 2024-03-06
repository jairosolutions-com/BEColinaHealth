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
export class VitalSigns {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  uuid: string;

  @Column()
  @Field()
  date: string;

  @Column({ nullable: true })
  @Field()
  time: string;

  @Column({ nullable: true })
  @Field()
  bloodPressure: string;

  @Column({ nullable: true })
  @Field()
  heartRate: string;

  @Column({ nullable: true })
  @Field()
  temperature: string;

  @Column({ nullable: true })
  @Field()
  respiratoryRate: string;

  @Column({ nullable: true })
  @Field(() => Int)
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


  //vital_signs Table with FK patientId from PatientInformation table
  @ManyToOne(() => PatientInformation, (patient) => patient.vital_signs)
  @JoinColumn({
    name: 'patientId',
  })
  patient: PatientInformation;
}
