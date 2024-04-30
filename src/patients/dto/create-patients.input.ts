import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class CreatePatientsInput {
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

  @IsNotEmpty()
  @Field()
  middleName: string;

  @Field((type) => Int)
  age: number;

  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field()
  dateOfBirth: Date;


  @Field()
  gender: string;

  @Field()
  city: string;

  address1: string;
  address2: string;

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
