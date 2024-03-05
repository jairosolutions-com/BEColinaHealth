import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateMedicationInput {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @IsNotEmpty()
  @Field()
  medicationName: string;

  @IsNotEmpty()
  @Field()
  medicationDate: string;

  @IsNotEmpty()
  @Field()
  medicationTime: string;

  @IsNotEmpty()
  @Field()
  notes: string;

  @IsNotEmpty()
  @Field()
  patientId: number;

  @Field()
  prescriptionId: number;

  @IsNotEmpty()
  @Field()
  medicationStatus: string;

  @Field()
  updated_at: string;

  @Field()
  created_at: string;

  @Field()
  deleted_at: string;
}
