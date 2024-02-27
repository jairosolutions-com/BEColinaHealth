import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class VitalSign {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
