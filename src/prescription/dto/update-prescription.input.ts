import { CreatePrescriptionInput } from './create-prescription.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePrescriptionInput extends PartialType(CreatePrescriptionInput) {
  @Field(() => Int)
  id: number;
}
