import { Patients } from 'src/patients/entities/patients.entity';
import { Users } from 'src/users/entities/users.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Companies {
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
  countries: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;

  @OneToMany(() => Patients, (patient) => patient.companies)
  patient: Patients[];

  @OneToMany(() => Users, (users) => users.companies)
  users: Users[];
}
