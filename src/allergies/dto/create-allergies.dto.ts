import { Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

export class CreateAllergiesInput {

  @Field()
  uuid: string;

  @IsNotEmpty()
  @Field()
  type: string;

  @IsNotEmpty()
  @Field()
  allergen: string;

  @Field()
  severity: string;

  @Field()
  reaction: string;

  @Field()
  notes: string;

  @IsNotEmpty()
  @Field()
  patientId: number;
}
