import { Patients } from 'src/patients/entities/patients.entity';
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

@Entity('forms')
export class Forms {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  nameOfDocument: string;

  @Column()
  dateIssued: string;

  @Column()
  notes: string;

  @Column({ nullable: true })
  patientId: number;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;

  //Forms Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patient) => patient.forms)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;
}
