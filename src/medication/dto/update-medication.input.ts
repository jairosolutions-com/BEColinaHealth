import { CreateMedicationInput } from './create-medication.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMedicationInput extends PartialType(CreateMedicationInput) {
  @Field(() => Int)
  id: number;
}
