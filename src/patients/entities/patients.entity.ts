import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Allergies } from 'src/allergies/entities/allergies.entity';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { Companies } from 'src/companies/entities/companies.entity';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';


import { Notes } from 'src/notes/entities/notes.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { Surgeries } from 'src/surgeries/entities/surgeries.entity';
import { VitalSigns } from 'src/vitalSigns/entities/vitalSigns.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Patients {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  uuid: string;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column({ nullable: true })
  @Field((type) => Int)
  age: number;

  @Column({ type: 'date', nullable: true })
  @Field()
  dateOfBirth: Date;

  @Column({ nullable: true })
  medicalCondition: string;

  @Column()
  @Field()
  gender: string;

  @Column()
  @Field()
  city: string;

  @Column()
  @Field()
  state: string;

  @Column()
  @Field()
  zip: string;

  @Column()
  @Field()
  countries: string;

  @Column()
  @Field()
  phoneNo: string;


  @Column({ type: 'date', nullable: true })
  @Field()
  admissionDate: Date;

  @Column({ nullable: true })
  @Field()
  codeStatus: string;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  @Field()
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  @Field()
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  @Field()
  deletedAt: string;

  //RELATIONAL FIELDS

  //Patient information to table medicationLogs
  @OneToMany(() => MedicationLogs, (medicationLogs) => medicationLogs.patients)
  @Field(() => [MedicationLogs], { nullable: true })
  medicationLogs: MedicationLogs[];

  //Patient information to table PRESCRIPTION

  @OneToMany(
    () => Prescriptions,
    (prescriptions) => prescriptions.patients,
  )
  prescriptions: Prescriptions[];

  //Patient information to table VitalSigns
  @OneToMany(() => VitalSigns, (vitalSigns) => vitalSigns.patient)
  @Field(() => [VitalSigns], { nullable: true })
  vitalSigns: VitalSigns[];

  // //Patient information to table MedicalHistory
  // @OneToMany(() => MedicalHistory, (medical_history) => medical_history.patient)
  // @Field(() => [MedicalHistory], { nullable: true })
  // medical_history: MedicalHistory[];

  //Patient information to table LabResults
  @OneToMany(() => LabResults, (lab_results) => lab_results.patient)
  @Field(() => [LabResults], { nullable: true })
  lab_results: LabResults[];

  //Patient information to table Notes
  @OneToMany(() => Notes, (notes) => notes.patient)
  @Field(() => [Notes], { nullable: true })
  notes: Notes[];

  //Patient information to table Appointments
  @OneToMany(() => Appointments, (appointments) => appointments.patients)
  @Field(() => [Appointments], { nullable: true })
  appointments: Appointments[];

  //Patient information to table Emergency Contact
  @OneToMany(
    () => EmergencyContacts,
    (emergencyContacts) => emergencyContacts.patient,
  )
  @Field(() => [EmergencyContacts], { nullable: true })
  emergencyContacts: EmergencyContacts[];

  //Patient Information with FK patientId from Companies table
  @ManyToOne(() => Companies, (companies) => companies.patient)
  @JoinColumn({
    name: 'companyId',
  })
  companies: Companies;

  //Patient information to table Allergies
  @OneToMany(() => Allergies, (allergies) => allergies.patient)
  allergies: Allergies[];

  //Patient information to table Allergies
  @OneToMany(() => Surgeries, (surgeries) => surgeries.patient)
  surgeries: Surgeries[];
}
