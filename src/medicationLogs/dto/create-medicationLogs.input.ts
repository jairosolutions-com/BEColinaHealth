import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateMedicationLogsInput {
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

  @IsNotEmpty()
  @Field()
  notes: string;

  @IsNotEmpty()
  @Field()
  patientId: number;

  @Field()
  medicationLogsType: string;

  @IsNotEmpty()
  @Field()
  medicationLogsStatus: string;

  @Field()
  updatedAt: string;

  @Field()
  createdAt: string;

  @Field()
  deletedAt: string;
}
