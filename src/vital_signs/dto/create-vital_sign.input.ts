import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVitalSignInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
