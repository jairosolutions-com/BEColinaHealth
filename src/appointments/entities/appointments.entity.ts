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
  @Field()
  uuid: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  dateCreated: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  appointmentsDate: Date;

  @Column({ type: 'time', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  appointmentsTime: string;

  @Column()
  @Field()
  details: string;

  @Column()
  @Field()
  appointmentsStatus: string;

  @Column({ nullable: true })
  @Field()
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
