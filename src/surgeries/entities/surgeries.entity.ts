import { Patients } from 'src/patients/entities/patients.entity';
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
export class Surgeries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column({ type: 'date', nullable: true })
  dateOfSurgeries: Date;

  @Column()
  typeOfSurgeries: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;

  @ManyToOne(() => Patients, (patient) => patient.surgeries)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;
}
