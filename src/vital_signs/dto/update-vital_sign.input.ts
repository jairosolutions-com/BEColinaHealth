import { IsNotEmpty } from 'class-validator';
import { CreateVitalSignInput } from './create-vital_sign.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVitalSignInput extends PartialType(CreateVitalSignInput) {
  @IsNotEmpty()
  @Field((type) => Int)
  id: number;

  @IsNotEmpty()
  @Field()
  uuid: string;

  @IsNotEmpty()
  @Field()
  date: string;

  @IsNotEmpty()
  @Field()
  time: string;

  @Field()
  bloodPressure: string;

  @Field()
  heartRate: string;

  @Field()
  temperature: string;

  @Field()
  respiratoryRate: string;

  @IsNotEmpty()
  @Field(() => Int)
  patientId: number;

  @IsNotEmpty()
  @Field()
  updated_at: string;

  @IsNotEmpty()
  @Field()
  created_at: string;

  @IsNotEmpty()
  @Field()
  deleted_at: string;

}
