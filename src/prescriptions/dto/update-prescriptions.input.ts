import { IsNotEmpty } from 'class-validator';
import { CreatePrescriptionsInput } from './create-prescriptions.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePrescriptionsInput extends PartialType(CreatePrescriptionsInput) {
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
  updatedAt: string;

  @Field({ nullable: true })
  createdAt: string;

  @Field({ nullable: true })
  deletedAt: string;

}
