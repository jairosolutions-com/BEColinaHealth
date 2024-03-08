import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAppointmentsInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
