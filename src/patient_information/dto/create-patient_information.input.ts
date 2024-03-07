import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreatePatientInformationInput {
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
  allergies: string;

  @Field()
  codeStatus: string;

  @Field()
  updated_at: string;

  @Field()
  created_at: string;
  
  @Field()
  deleted_at: string;

}
