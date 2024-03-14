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

@Entity()
@ObjectType()
export class Appointments {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  uuid: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column()
  appointmentDate: string;

  @Column()
  appointmentTime: string;

  @Column()
  appointmentEndTime: string;

  @Column()
  details: string;

  @Column()
  appointmentStatus: string;

  @Column()
  @Field((type) => Int)
  patientId: number;
  
  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;

  //Appointments Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patients) => patients.appointments)
  @JoinColumn({
    name: 'patientId',
  })
  patients: Patients;
}
