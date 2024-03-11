import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Patients } from 'src/patients/entities/patients.entity';
;

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

@Entity('medicationLogs')
@ObjectType()
export class MedicationLogs {
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

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  @Field()
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  @Field()
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  @Field()
  deletedAt: string;




  //MedicationLogs Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patient) => patient.medicationLogs)
  @JoinColumn({
    name: 'patientId',
  })
  patients: Patients;
  // // Foreign key reference to the Prescriptions entity
  // @ManyToOne(() => Prescriptions)
  // @JoinColumn({ name: 'prescriptionsId', referencedColumnName: 'id' }) // FK attribute
  // prescriptions: Prescriptions;

}

