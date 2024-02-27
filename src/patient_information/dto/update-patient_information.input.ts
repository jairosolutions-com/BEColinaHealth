import { CreatePatientInformationInput } from './create-patient_information.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePatientInformationInput extends PartialType(CreatePatientInformationInput) {
  @Field(() => Int)
  id: number;
}
