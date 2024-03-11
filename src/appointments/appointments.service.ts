import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentsInput } from './dto/create-appointments.input';
import { UpdateAppointmentsInput } from './dto/update-appointments.input';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Repository } from 'typeorm';
import { Appointments } from './entities/appointments.entity';

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

  async getAllAppointmentsByPatient(patientId: number, page: number = 1, sortBy: string = 'appointmentDate', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: Appointments[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const totalPatientAppointments = await this.appointmentsRepository.count({
      where: { patientId },
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientAppointments / perPage);
    const appointmentsList = await this.appointmentsRepository.find({
      where: { patientId },
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
    return this.appointmentsRepository.find();
  }

  async updateAppointment(id: number,
    updateLabResultsInput: UpdateAppointmentsInput,
  ): Promise<Appointments> {
    const { ...updateData } = updateLabResultsInput;
    const labResults = await this.appointmentsRepository.findOne({ where: { id } });
    if (!Appointments) {
      throw new NotFoundException(`Lab Result ID-${id}  not found.`);
    }
    Object.assign(labResults, updateData);
    return this.appointmentsRepository.save(labResults);
  }

  async softDeleteAppointment(id: number):  Promise<{ message: string, deletedLabResult: Appointments }> {
    const appointments = await this.appointmentsRepository.findOne({ where: { id } });
    if (!Appointments) {
      throw new NotFoundException(`Appointment ID-${id} does not exist.`);
    }
    appointments.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedLabResult = await this.appointmentsRepository.save(appointments);

    return { message: `Appointment with ID ${id} has been soft-deleted.`, deletedLabResult };
  }
}
