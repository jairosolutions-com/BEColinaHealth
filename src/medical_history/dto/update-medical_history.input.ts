import { CreateMedicalHistoryInput } from './create-medical_history.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMedicalHistoryInput extends PartialType(CreateMedicalHistoryInput) {
  @Field(() => Int)
  id: number;
}
