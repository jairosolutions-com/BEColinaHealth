import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class MedicalHistory {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
