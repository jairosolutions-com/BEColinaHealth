import { CreateVitalSignInput } from './create-vital_sign.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVitalSignInput extends PartialType(CreateVitalSignInput) {
  @Field(() => Int)
  id: number;
}
