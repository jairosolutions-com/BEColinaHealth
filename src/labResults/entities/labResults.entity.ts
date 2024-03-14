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

@Entity('labResults')
@ObjectType()
export class LabResults {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  uuid: string;

  @Column({ nullable: true })
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

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  @Field()
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  @Field()
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  @Field()
  deletedAt: string;


  //LabResults Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patient) => patient.lab_results)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;
}