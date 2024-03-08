import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEmergencyContactsInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
