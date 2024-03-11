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

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  @Field()
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  @Field()
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  @Field()
  deletedAt: string;


  //vitalSigns Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patient) => patient.vitalSigns)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;
}
