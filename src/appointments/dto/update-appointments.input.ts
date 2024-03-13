import { CreateAppointmentsInput } from './create-appointments.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAppointmentsInput extends PartialType(CreateAppointmentsInput) {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @Field()
  dateCreated: Date;

  @Field()
  appointmentDate: string;

  @Field()
  appointmentTime: string;

  @Field()
  appointmentEndTime: string;

  @Field()
  details: string;

  @Field()
  appointmentStatus: string;

  @Field((type) => Int)
  patientId: number;
  
  updatedAt: string;

  @Field()
  createdAt: string;

  @Field()
  deletedAt: string;
}
