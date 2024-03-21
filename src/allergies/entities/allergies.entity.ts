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

@Entity()
export class Allergies {
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

  @Column()
  patientId: number;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;

  @ManyToOne(() => Patients, (patient) => patient.allergies)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;


}
