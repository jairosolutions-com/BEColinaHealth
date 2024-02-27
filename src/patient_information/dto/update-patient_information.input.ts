import { CreatePatientInformationInput } from './create-patient_information.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePatientInformationInput extends PartialType(CreatePatientInformationInput) {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field((type) => Int)
  age: number;

  @Field()
  dateOfBirth: Date;

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
