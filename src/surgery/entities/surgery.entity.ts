import { PatientInformation } from 'src/patient_information/entities/patient_information.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm';

@Entity()
export class Surgery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column({ type: 'date', nullable: true })
  dateOfSurgery: Date;

  @Column()
  typeOfSurgery: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  created_at: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updated_at: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: string;

  @ManyToOne(() => PatientInformation, (patient) => patient.surgery)
  @JoinColumn({
    name: 'patientId',
  })
  patient: PatientInformation;
}
