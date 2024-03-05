import { CreateMedicationInput } from './create-medication.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMedicationInput extends PartialType(CreateMedicationInput) {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @Field()
  medicationName: string;

  @Field()
  medicationDate: string;

  @Field()
  medicationTime: string;

  @Field()
  notes: string;


  @Field()
  patientId: number;

  @Field()
  prescriptionId: number;

  @Field()
  medicationStatus: string;

  @Field()
  updated_at: string;

  @Field()
  created_at: string;

  @Field()
  deleted_at: string;

}
