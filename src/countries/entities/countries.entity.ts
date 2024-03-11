import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
@Entity()
@ObjectType()
export class Countries {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  countryId: number;

  @Column()
  @Field()
  name: string;
}
