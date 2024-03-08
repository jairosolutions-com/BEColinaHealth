import { CreateAppointmentsInput } from './create-appointments.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAppointmentsInput extends PartialType(CreateAppointmentsInput) {
  @Field(() => Int)
  id: number;
}
