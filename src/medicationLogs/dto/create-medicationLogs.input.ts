import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateMedicationLogsInput {
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
}
