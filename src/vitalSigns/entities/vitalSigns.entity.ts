import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Patients } from 'src/patients/entities/patients.entity';

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

@Entity('vitalSigns')
@ObjectType()
export class VitalSigns {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  uuid: string;

  @Column({ nullable: true })
  bloodPressure: string;

  @Column({ nullable: true })
  heartRate: string;

  @Column({ nullable: true })
  temperature: string;

  @Column({ nullable: true })
  respiratoryRate: string;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  @Field(() => Int)
  patientId: number;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;


  //vitalSigns Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patient) => patient.vitalsign)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;
}
