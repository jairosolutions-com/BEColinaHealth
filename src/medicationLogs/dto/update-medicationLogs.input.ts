import { IsNotEmpty } from 'class-validator';
import { CreateMedicationLogsInput } from './create-medicationLogs.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMedicationLogsInput extends PartialType(
  CreateMedicationLogsInput,
) {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @IsNotEmpty()
  @Field()
  medicationLogsName: string;

  @IsNotEmpty()
  @Field()
  medicationLogsDate: string;

  @IsNotEmpty()
  @Field()
  medicationLogsTime: string;

  @Field()
  notes: string;

  @IsNotEmpty()
  @Field()
  patientId: number;

  @IsNotEmpty()
  @Field()
  medicationType: string;

  @Field()
  medicationLogStatus: string;

  @Field()
  updatedAt: string;

  @Field()
  createdAt: string;

  @Field()
  deletedAt: string;
}
