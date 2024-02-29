import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePrescriptionInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
