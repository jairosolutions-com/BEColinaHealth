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
export class Notes {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  uuid: string;

  @Column()
  @Field()
  subject: string;

  @Column()
  @Field()
  notes: string;

  @Column()
  type:string

  @Column({ nullable: true })
  @Field(() => Int)
  patientId: number;

  @UpdateDateColumn({ nullable: true })
  @Field()
  updatedAt: string;

  @CreateDateColumn({ nullable: true })
  @Field()
  createdAt: string;

  @DeleteDateColumn({ nullable: true })
  @Field()
  deletedAt: string;

  //Notes Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patient) => patient.notes)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;
}
