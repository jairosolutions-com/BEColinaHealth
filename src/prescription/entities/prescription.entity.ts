import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PatientInformation } from 'src/patient_information/entities/patient_information.entity';
import { ManyToOne, JoinColumn, Column, PrimaryGeneratedColumn, Entity, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, Index } from 'typeorm';
@Entity()
@ObjectType()


export class Prescription {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  uuid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  numDays: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @Column()
  interval: string;

  @Column()
  maintenance: boolean;

  @Column({nullable:true})
  patientId: number;


  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  @Field()
  updated_at: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  @Field()
  created_at: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Field()
  deleted_at: string;

  @ManyToOne(() => PatientInformation, patientInformation => patientInformation.prescription)
  @JoinColumn({ name: 'patientId' }) // FK attribute
  patientInformation: PatientInformation;
} 
