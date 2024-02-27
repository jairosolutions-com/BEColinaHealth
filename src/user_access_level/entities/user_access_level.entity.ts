import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserAccessLevel {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
