import { CreateEmergencyContactInput } from './create-emergency_contact.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEmergencyContactInput extends PartialType(CreateEmergencyContactInput) {
  @Field(() => Int)
  id: number;
}
