import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentsInput } from './dto/create-appointments.input';
import { UpdateAppointmentsInput } from './dto/update-appointments.input';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentService: AppointmentsService) { }
  @Post()
  createAppointments(@Body() createAppointmentsInput: CreateAppointmentsInput) {
    return this.appointmentService.createAppointments(createAppointmentsInput);
  }
  @Get()
  getAppointments(){
    return this.appointmentService.getAllAppointments();
  }
  @Get('id')
  findAllAppointmentsByPatient(
    @Param('id') patientId: number,
    @Query('page') page: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC',) {
        return this.appointmentService.getAllAppointmentsByPatient(patientId, page, sortBy, sortOrder); 
  }
  @Patch('update/:id') 
  updateAppointments(@Param('id') id: number, @Body() updateAppointmentsInput: UpdateAppointmentsInput) {
    return this.appointmentService.updateAppointment(id, updateAppointmentsInput);
  }
  @Patch('delete/:id')
  deleteAppointments(@Param('id') id: number) {
    return this.appointmentService.softDeleteAppointment(id);
  }
 }
