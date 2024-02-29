import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PatientInformation } from 'src/patient_information/entities/patient_information.entity';
import { ManyToOne, JoinColumn, Column } from 'typeorm';

@ObjectType()
export class Prescription {
  id: number;

  @Column()
  name: string;

  @Column({nullable:true})
  numDays: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @Column()
  interval: string;

  @Column()
  maintenance: boolean;

  @Column()
  patientId: boolean;

  @ManyToOne(() => PatientInformation, patient => patient.prescriptions)
  @JoinColumn({ name: 'id' })
  patient: PatientInformation;
} 
