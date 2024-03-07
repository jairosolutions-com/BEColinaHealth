import { IsNotEmpty } from 'class-validator';
import { CreatePrescriptionInput } from './create-prescription.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePrescriptionInput extends PartialType(CreatePrescriptionInput) {
  @Field((type) => Int)
  id: number;

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
