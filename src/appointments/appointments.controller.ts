import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentsInput } from './dto/create-appointments.input';
import { UpdateAppointmentsInput } from './dto/update-appointments.input';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}
  @Post()
  createAppointments(@Body() createAppointmentsInput: CreateAppointmentsInput) {
    // this.appointmentService.handleCron();
    return this.appointmentService.createAppointments(createAppointmentsInput);
  }
  @Post('getAll')
  getAppointments() {
    return this.appointmentService.getAllAppointments();
  }
  @Post('id')
  findAllAppointmentsByPatient(
    @Param('id') patientId: string,
    @Query('page') page: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC',
  ) {
    return this.appointmentService.getAllAppointmentsByPatient(
      patientId,
      page,
      sortBy,
      sortOrder,
    );
  }
  @Patch('update/:id')
  updateAppointments(
    @Param('id') id: string,
    @Body() updateAppointmentsInput: UpdateAppointmentsInput,
  ) {
    return this.appointmentService.updateAppointment(
      id,
      updateAppointmentsInput,
    );
  }
  @Patch(':id/mark-successful')
  async markAppointmentAsSuccessful(@Param('id') id: string) {
    await this.appointmentService.markAppointmentAsSuccessful(id);
    return { message: 'Appointment marked as successful' };
  }
  @Patch('delete/:id')
  deleteAppointments(@Param('id') id: string) {
    return this.appointmentService.softDeleteAppointment(id);
  }
}
