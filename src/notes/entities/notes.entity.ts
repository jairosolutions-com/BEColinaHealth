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
export class Notes {
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
  notes: string;

  @Column({ nullable: true })
  @Field()
  updatedAt: string;

  @Column({ nullable: true })
  @Field()
  createdAt: string;

  @Column({ nullable: true })
  @Field()
  deletedAt: string;

  //Notes Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patient) => patient.notes)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;
}
