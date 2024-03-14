import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAppointmentsInput } from './dto/create-appointments.input';
import { UpdateAppointmentsInput } from './dto/update-appointments.input';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Repository } from 'typeorm';
import { Appointments } from './entities/appointments.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointments)
    private appointmentsRepository: Repository<Appointments>,
    private idService: IdService, // Inject the IdService
  ) { }


  async createAppointments(input: CreateAppointmentsInput): Promise<Appointments> {
    const existingAppointment = await this.appointmentsRepository.findOne({
      where: {
        appointmentDate: (input.appointmentDate),
        appointmentStatus: (input.appointmentStatus),
        appointmentTime: (input.appointmentTime),
        appointmentEndTime: (input.appointmentEndTime),
      },
    });
    if (existingAppointment) {
      throw new ConflictException('Appointment already exists.');
    }
    const newAppointments = new Appointments();
    const uuidPrefix = 'APT-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newAppointments.uuid = uuid;
    Object.assign(newAppointments, input);
    return this.appointmentsRepository.save(newAppointments);
  }

  async getAllAppointmentsByPatient(patientId: string, page: number = 1, sortBy: string = 'appointmentDate', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: Appointments[], totalPages: number, currentPage: number, totalCount }> {

    const skip = (page - 1) * perPage;
    const totalPatientAppointments = await this.appointmentsRepository.count({
      where: { uuid: patientId },
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientAppointments / perPage);
    const appointmentsList = await this.appointmentsRepository.find({
      where: { uuid: patientId },
      skip: skip,
      take: perPage,
    });
    return {
      data: appointmentsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientAppointments
    };
  }

  async getAllAppointments(): Promise<Appointments[]> {
    const currentTimeFormatted = this.getCurrentTimeFormatted();
    const currentDate = new Date(); // Get current date
    const formattedDate = this.formatDate(currentDate);
    console.log('Current Time:', currentTimeFormatted); // Log current time
    console.log('Current Date:', formattedDate); // Log current time

    return this.appointmentsRepository.find();

  }

  async updateAppointment(id: string,
    updateLabResultsInput: UpdateAppointmentsInput,
  ): Promise<Appointments> {
    const { ...updateData } = updateLabResultsInput;
    const labResults = await this.appointmentsRepository.findOne({ where: { uuid: id } });
    if (!Appointments) {
      throw new NotFoundException(`Lab Result ID-${id}  not found.`);
    }
    Object.assign(labResults, updateData);
    return this.appointmentsRepository.save(labResults);
  }

  async softDeleteAppointment(id: number): Promise<{ message: string, deletedLabResult: Appointments }> {
    const appointments = await this.appointmentsRepository.findOne({ where: { uuid: id } });
    if (!Appointments) {
      throw new NotFoundException(`Appointment ID-${id} does not exist.`);
    }
    appointments.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedLabResult = await this.appointmentsRepository.save(appointments);

    return { message: `Appointment with ID ${id} has been soft-deleted.`, deletedLabResult };
  }


  getCurrentTimeFormatted(): string {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const meridiem = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Pad single digit minutes with leading zero
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Format the time string
    const formattedTime = `${hours}:${paddedMinutes}${meridiem}`;

    return formattedTime;
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Format the time string
    const formattedDate = `${year}-${day}-${month}`; // Order: yyyy-dd-mm;
    return formattedDate;
  }
  async updateAppointmentStatusDefault() {
    const appointments = await this.appointmentsRepository.find(); // Retrieve all appointments from the database
    const currentTimeFormatted = this.getCurrentTimeFormatted();
    const currentDate = new Date(); // Get current date
    const formattedDate = this.formatDate(currentDate);
    console.log('Current Time:', currentTimeFormatted); // Log current time
    console.log('Current Date:', formattedDate); // Log current time

    for (const appointment of appointments) {
      if (formattedDate == appointment.appointmentDate && currentTimeFormatted <= appointment.appointmentEndTime) {
        appointment.appointmentStatus = 'ongoing';
      }
      else if (currentTimeFormatted > appointment.appointmentEndTime && appointment.appointmentStatus !== 'Successful') {
        appointment.appointmentStatus = 'Missed';
      }
      console.log('Current Time:', currentTimeFormatted); // Log current time

      return this.appointmentsRepository.save(appointment);
    }
  }
  async markAppointmentAsSuccessful(id: number) {
    const appointment = await this.appointmentsRepository.findOne({ where: { uuid: id } });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    appointment.appointmentStatus = 'Successful';
    await this.appointmentsRepository.save(appointment);
  }

}
