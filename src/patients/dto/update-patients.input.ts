import { IsNotEmpty } from 'class-validator';
import { CreatePatientsInput } from './create-patients.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePatientsInput extends PartialType(CreatePatientsInput) {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @IsNotEmpty()
  @Field()
  firstName: string;

  @IsNotEmpty()
  @Field()
  lastName: string;

  @Field((type) => Int)
  age: number;

  @IsNotEmpty()
  @Field()
  dateOfBirth: Date;

  @Field()
  medicalCondition: string;

  @Field()
  gender: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  zip: string;

  @Field()
  country: string;

  @Field()
  phoneNo: string;


  @Field()
  codeStatus: string;

  @Field()
  updatedAt: string;

  @Field()
  createdAt: string;

  @Field()
  deletedAt: string;

}
