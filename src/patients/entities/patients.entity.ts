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
  uuid: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({nullable: true})
  middleName: string;

  @Column({ nullable: true })
  @Field((type) => Int)
  age: number;

  @Column({nullable: true})
  email: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  medicalCondition: string;

  @Column()
  gender: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @Column()
  @Field()
  country: string;

  @Column({nullable: true})
  address1: string;

  @Column({nullable: true})
  address2: string;

  @Column({ nullable: true })
  phoneNo: string;


  @Column({ type: 'date', nullable: true })
  admissionDate: Date;

  @Column({ nullable: true })
  codeStatus: string;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;

  //RELATIONAL FIELDS

  //Patient information to table medicationLogs
  @OneToMany(() => MedicationLogs, (medicationlogs) => medicationlogs.patient)
  @Field(() => [MedicationLogs], { nullable: true })
  medicationlogs: MedicationLogs[];

  //Patient information to table PRESCRIPTION
  @OneToMany(() => Prescriptions,
    (prescriptions) => prescriptions.patient)
    @Field(() => [Prescriptions], { nullable: true })
    prescriptions: Prescriptions[];

  //Patient information to table VitalSigns
  @OneToMany(() => VitalSigns, (vitalsign) => vitalsign.patient)
  @Field(() => [VitalSigns], { nullable: true })
  vitalsign: VitalSigns[];

  //Patient information to table LabResults
  @OneToMany(() => LabResults, (lab_results) => lab_results.patient)
  @Field(() => [LabResults], { nullable: true })
  lab_results: LabResults[];

  //Patient information to table Notes
  @OneToMany(() => Notes, (notes) => notes.patient)
  @Field(() => [Notes], { nullable: true })
  notes: Notes[];

  //Patient information to table Appointments
  @OneToMany(() => Appointments, (appointments) => appointments.patient)
  @Field(() => [Appointments], { nullable: true })
  appointments: Appointments[];

  //Patient information to table Emergency Contact
  @OneToMany(
    () => EmergencyContacts,
    (contact) => contact.patient,
  )
  @Field(() => [EmergencyContacts], { nullable: true })
  contact: EmergencyContacts[];

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
