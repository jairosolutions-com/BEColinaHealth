import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateVitalSignInput {

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

}
