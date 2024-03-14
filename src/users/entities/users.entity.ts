import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Companies } from 'src/companies/entities/companies.entity';
import { UserAccessLevels } from 'src/userAccessLevels/entities/userAccessLevels.entity';
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
  id: number;

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

  @Column({ nullable: true }) // Nullable because the token might not be set initially
  @Field({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  resetTokenExpires: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  @Field()
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  @Field()
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  @Field()
  deletedAt: string;

  //Patient Information with FK patientId from Companies table
  @ManyToOne(() => Companies, (companies) => companies.users)
  @JoinColumn({
    name: 'companyId',
  })
  companies: Companies;

  @OneToMany(() => UserAccessLevels, (ual) => ual.users) // Use @OneToMany here
  ual: UserAccessLevels[];
}
