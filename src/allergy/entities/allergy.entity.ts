import { PatientInformation } from 'src/patient_information/entities/patient_information.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Allergy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  type: string;

  @Column()
  allergen: string;

  @Column()
  severity: string;

  @Column()
  reaction: string;

  @Column()
  notes: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  created_at: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updated_at: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: string;

  @ManyToOne(() => PatientInformation, (patient) => patient.allergy)
  @JoinColumn({
    name: 'patientId',
  })
  patient: PatientInformation;
}
