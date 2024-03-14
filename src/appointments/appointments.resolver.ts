import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AppointmentsService } from './appointments.service';
import { Appointments } from './entities/appointments.entity';
import { CreateAppointmentsInput } from './dto/create-appointments.input';
import { UpdateAppointmentsInput } from './dto/update-appointments.input';

@Resolver(() => Appointments)
export class AppointmentsResolver {
  // constructor(private readonly appointmentsService: AppointmentsService) { }

  // @Mutation(() => Appointments)
  // createAppointments(@Args('createAppointmentsInput') createAppointmentsInput: CreateAppointmentsInput) {
  //   return this.appointmentsService.create(createAppointmentsInput);
  // }

  // @Query(() => [Appointments], { name: 'appointments' })
  // findAll() {
  //   return this.appointmentsService.findAll();
  // }

  // @Query(() => Appointments, { name: 'appointments' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.appointmentsService.findOne(id);
  // }

  // @Mutation(() => Appointments)
  // updateAppointments(@Args('updateAppointmentsInput') updateAppointmentsInput: UpdateAppointmentsInput) {
  //   return this.appointmentsService.update(updateAppointmentsInput.id, updateAppointmentsInput);
  // }

  // @Mutation(() => Appointments)
  // removeAppointments(@Args('id', { type: () => Int }) id: number) {
  //   return this.appointmentsService.remove(id);
  // }
}
