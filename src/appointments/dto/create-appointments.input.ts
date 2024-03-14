import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAppointmentsInput {
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
