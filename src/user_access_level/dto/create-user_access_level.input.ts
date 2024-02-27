import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserAccessLevelInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
