import { PatientInformation } from 'src/patient_information/entities/patient_information.entity';
import { Users } from 'src/users/entities/user.entity';

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  name: string;

  @Column()
  contactNo: string;

  @Column()
  website: string;

  @Column()
  email: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @Column({ nullable: true })
  updated_at: string;

  @Column({ nullable: true })
  created_at: string;

  @Column({ nullable: true })
  deleted_at: string;

  @OneToMany(() => PatientInformation, (patient) => patient.company)
  patient: PatientInformation[];

  @OneToMany(() => Users, (users) => users.company)
  users: Users[];
}
