import { CreateUserAccessLevelInput } from './create-user_access_level.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserAccessLevelInput extends PartialType(CreateUserAccessLevelInput) {
  @Field(() => Int)
  id: number;
}
