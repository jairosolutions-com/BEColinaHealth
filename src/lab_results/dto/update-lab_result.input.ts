import { CreateLabResultInput } from './create-lab_result.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLabResultInput extends PartialType(CreateLabResultInput) {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @Field()
  date: string;

  @Field()
  hemoglobinA1c: string;

  @Field()
  fastingBloodGlucose: string;

  @Field()
  totalCholesterol: string;

  @Field()
  ldlCholesterol: string;

  @Field()
  hdlCholesterol: string;

  @Field()
  triglycerides: string;

  @Field()
  patientId: number;

  @Field()
  updated_at: string;

  @Field()
  created_at: string;

  @Field()
  deleted_at: string;
}
