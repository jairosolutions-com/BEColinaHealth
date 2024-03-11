import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Patients } from 'src/patients/entities/patients.entity';

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
export class Appointments {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  uuid: string;

  @Column()
  dateCreated: Date;

  @Column()
  appointmentDate: Date;

  @Column()
  appointmentTime: string;

  @Column()
  details: string;

  @Column()
  appointmentStatus: string;

  @Column()
  @Field((type) => Int)
  patientId: number;
  
  @Column({ nullable: true })
  updatedAt: string;

  @Column({ nullable: true })
  @Field()
  createdAt: string;

  @Column({ nullable: true })
  @Field()
  deletedAt: string;

  //Appointments Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patients) => patients.appointments)
  @JoinColumn({
    name: 'patientId',
  })
  patients: Patients;
}
