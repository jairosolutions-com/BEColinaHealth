import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMedicationInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
