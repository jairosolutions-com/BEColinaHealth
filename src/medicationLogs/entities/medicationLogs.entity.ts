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

@Entity('medicationLogs')
@ObjectType()
export class MedicationLogs {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ nullable: true })
  uuid: string;

  @Column()
  medicationLogsName: string;

  @Column()
  medicationLogsDate: string;

  @Column()
  @Field()
  medicationLogsTime: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  @Field(() => Int)
  patientId: number;

  @Column({ nullable: true })
  medicationType: string;

  @Column({ nullable: true })
  medicationLogStatus: string;

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
  @ManyToOne(() => Patients, (patient) => patient.medicationlogs)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;
  // // Foreign key reference to the Prescriptions entity
  // @ManyToOne(() => Prescriptions)
  // @JoinColumn({ name: 'prescriptionsId', referencedColumnName: 'id' }) // FK attribute
  // prescriptions: Prescriptions;
}
