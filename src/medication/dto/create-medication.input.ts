import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMedicationInput {
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
