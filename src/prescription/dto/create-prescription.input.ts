import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreatePrescriptionInput {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @IsNotEmpty()
  @Field()
  name: string;

  @Field({ nullable: true })
  numDays: string;

  @IsNotEmpty()
  @Field()
  dosage: string;

  @Field()
  frequency: string;

  @Field()
  interval: string;

  @Field()
  maintenance: boolean;

  @Field()
  patientId: number;

  @Field()
  updated_at: string;

  @Field({ nullable: true })
  created_at: string;

  @Field({ nullable: true })
  deleted_at: string;
  
}
