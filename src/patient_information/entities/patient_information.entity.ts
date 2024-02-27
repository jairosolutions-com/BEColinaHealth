import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PatientInformation {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
