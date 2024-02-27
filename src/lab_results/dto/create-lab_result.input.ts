import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLabResultInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
