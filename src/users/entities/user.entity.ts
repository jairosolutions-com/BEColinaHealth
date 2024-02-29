import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Company } from 'src/company/entities/company.entity';
import { UserAccessLevel } from 'src/user_access_level/entities/user_access_level.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Users {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  Id: number;

  @Column()
  @Field()
  uuid: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column()
  @Field()
  fName: string;

  @Column()
  @Field()
  lName: string;

  @Column()
  @Field()
  status: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  @Field()
  updated_at: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  @Field()
  created_at: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Field()
  deleted_at: string;

  //Patient Information with FK patientId from Company table
  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({
    name: 'companyId',
  })
  company: Company;

  @OneToMany(() => UserAccessLevel, (ual) => ual.users) // Use @OneToMany here
  ual: UserAccessLevel[];
}
