import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';

@Resolver(() => Appointment)
export class AppointmentResolver {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Mutation(() => Appointment)
  createAppointment(@Args('createAppointmentInput') createAppointmentInput: CreateAppointmentInput) {
    return this.appointmentService.create(createAppointmentInput);
  }

  @Query(() => [Appointment], { name: 'appointment' })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Query(() => Appointment, { name: 'appointment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.appointmentService.findOne(id);
  }

  @Mutation(() => Appointment)
  updateAppointment(@Args('updateAppointmentInput') updateAppointmentInput: UpdateAppointmentInput) {
    return this.appointmentService.update(updateAppointmentInput.id, updateAppointmentInput);
  }

  @Mutation(() => Appointment)
  removeAppointment(@Args('id', { type: () => Int }) id: number) {
    return this.appointmentService.remove(id);
  }
}
