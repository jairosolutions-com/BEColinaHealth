import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLabResultInput {

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

}