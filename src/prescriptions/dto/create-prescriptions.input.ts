import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreatePrescriptionsInput {

  @Field()
  uuid: string;

  @IsNotEmpty()
  @Field()
  name: string;

  @Field({ nullable: true })
  status: string;

  @IsNotEmpty()
  @Field()
  dosage: string;

  @Field()
  frequency: string;

  @Field()
  interval: string;

  @Field()
  patientId: number;

  @Field()
  updatedAt: string;

  @Field({ nullable: true })
  createdAt: string;

  @Field({ nullable: true })
  deletedAt: string;

}
