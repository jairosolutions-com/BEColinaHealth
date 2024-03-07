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
export class Medication {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ nullable: true })
  uuid: string;

  @Column()
  medicationName: string;

  @Column()
  medicationDate: string;

  @Column()
  @Field()
  medicationTime: string;

  @Column()
  @Field()
  notes: string;

  @Column({ nullable: true })
  patientId: number;

  @Column({ nullable: true })
  medicationType: string;

  @Column()
  medicationStatus: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  @Field()
  updated_at: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  @Field()
  created_at: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Field()
  deleted_at: string;




  //Medication Table with FK patientId from PatientInformation table
  @ManyToOne(() => PatientInformation, (patient) => patient.medications)
  @JoinColumn({
    name: 'patientId',
  })
  patient: PatientInformation;
  // // Foreign key reference to the Prescription entity
  // @ManyToOne(() => Prescription)
  // @JoinColumn({ name: 'prescriptionId', referencedColumnName: 'id' }) // FK attribute
  // prescription: Prescription;

}

