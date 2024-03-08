import { CreateEmergencyContactsInput } from './create-emergencyContacts.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEmergencyContactsInput extends PartialType(CreateEmergencyContactsInput) {
  @Field(() => Int)
  id: number;
}
