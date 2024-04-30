import { Patients } from 'src/patients/entities/patients.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { Column,  CreateDateColumn, UpdateDateColumn,
  DeleteDateColumn,Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('patientsProfileImage')
export class PatientsProfileImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(null, { nullable: true })
  img_uuid: string;  

  @Column() 
  patientId: number;

  @Column()
  filename: string;

  @Column({
    type: 'bytea',
  })
  data: Uint8Array;
  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;
  @ManyToOne(
    () => Patients,
    (patients) => patients.patientProfileImage,
  )
  @JoinColumn({
    name: 'patientsId', //fk id
  })
  patients: Patients | null;
}

