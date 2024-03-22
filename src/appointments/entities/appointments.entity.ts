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

  @Column({nullable:true})
  appointmentDate: string;

  @Column({nullable:true})
  appointmentTime: string;

  @Column({nullable:true})
  appointmentEndTime: string;

  @Column({nullable:true})
  details: string;

  @Column({nullable:true})
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
  @ManyToOne(() => Patients, (patient) => patient.appointments)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;
}
