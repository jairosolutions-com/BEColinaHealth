import { CreateRolesInput } from './create-roles.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRolesInput extends PartialType(CreateRolesInput) {
  @Field(() => Int)
  id: number;
}
