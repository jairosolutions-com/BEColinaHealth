import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNotesInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
