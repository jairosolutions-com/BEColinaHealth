import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentsInput } from './dto/create-appointments.input';
import { UpdateAppointmentsInput } from './dto/update-appointments.input';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Brackets, Repository } from 'typeorm';
import { Appointments } from './entities/appointments.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Patients } from 'src/patients/entities/patients.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointments)
    private appointmentsRepository: Repository<Appointments>,

    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,

    private idService: IdService, // Inject the IdService
  ) { }

  async createAppointments(
    patientUuid: string,
    input: CreateAppointmentsInput,
  ): Promise<Appointments> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ['id'],
      where: { uuid: patientUuid },
    });
    const existingAppointment = await this.appointmentsRepository.findOne({
      where: {
        patientId: patientId,
        appointmentDate: input.appointmentDate,
        appointmentStatus: input.appointmentStatus,
        appointmentTime: input.appointmentTime,
        appointmentEndTime: input.appointmentEndTime,
      },
    });
    if (existingAppointment) {
      throw new ConflictException('Appointment already exists.');
    }
    const newAppointments = new Appointments();
    const uuidPrefix = 'APT-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newAppointments.uuid = uuid;
    newAppointments.patientId = patientId;
    Object.assign(newAppointments, input);
    const savedAppointments =
      await this.appointmentsRepository.save(newAppointments);
    const result = { ...savedAppointments };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;

    return result;
  }

  async getAllAppointmentsByPatient(
    patientUuid: string,
    term: string,
    page: number = 1,
    sortBy: string = 'appointmentStatus',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5,
  ): Promise<{
    data: Appointments[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term

    const skip = (page - 1) * perPage;
    const patientExists = await this.patientsRepository.findOne({
      where: { uuid: patientUuid },
    });

    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
    const appointmentsQueryBuilder = this.appointmentsRepository
      .createQueryBuilder('appointments')
      .innerJoinAndSelect('appointments.patient', 'patient')
      .select([
        'appointments.uuid',
        'appointments.dateCreated',
        'appointments.details',
        'appointments.appointmentTime',
        'appointments.appointmentStatus',
        'appointments.appointmentEndTime',
        'appointments.appointmentDate',
        'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })

      .orderBy(`appointments.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    console.log('PATIENT ID:', patientUuid);

    if (term !== '') {
      console.log('term', term);
      appointmentsQueryBuilder
        .where(
          new Brackets((qb) => {
            qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid });
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            qb.andWhere('appointments.uuid ILIKE :searchTerm', { searchTerm })
              .orWhere('appointments.appointmentStatus ILIKE :searchTerm', {
                searchTerm,
              })
              .orWhere('appointments.details ILIKE :searchTerm', {
                searchTerm,
              });
          }),
        );
    }
    const appointmentsList = await appointmentsQueryBuilder.getRawMany();

    const totalPatientAppointments = await appointmentsQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientAppointments / perPage);

    return {
      data: appointmentsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientAppointments,
    };
  }

  async getUpcomingAppointments(
    term: string,
    page: number = 1,
    sortBy: string = 'appointmentStatus',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5,
  ): Promise<{
    data: Appointments[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);
    const skip = (page - 1) * perPage;

    const appointmentsQueryBuilder = this.appointmentsRepository
      .createQueryBuilder('appointments')
      .innerJoinAndSelect('appointments.patient', 'patient')
      .select([
        'appointments.uuid',
        'appointments.appointmentTime',
        'appointments.appointmentStatus',
        'appointments.appointmentEndTime',
        'appointments.appointmentDate',
        'patient.uuid',
        'patient.firstName',
        'patient.lastName',
        'patient.middleName',
      ])
      .where('appointments.appointmentDate >= :todayDate', {
        todayDate: todayDate.toISOString().split('T')[0],
      })
      .andWhere('appointments.appointmentStatus = :appointmentStatus', {
        appointmentStatus: 'Scheduled',
      })
      .orderBy(`appointments.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);

    if (term !== '') {
      console.log('term', term);
      appointmentsQueryBuilder.where(
        new Brackets((qb) => {
          qb.andWhere('appointments.uuid ILIKE :searchTerm', { searchTerm })
            .orWhere('appointments.appointmentStatus ILIKE :searchTerm', {
              searchTerm,
            })
            .orWhere('appointments.details ILIKE :searchTerm', {
              searchTerm,
            });
        }),
      );
    }
    const appointmentsList = await appointmentsQueryBuilder.getRawMany();

    const totalPatientAppointments = await appointmentsQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientAppointments / perPage);

    return {
      data: appointmentsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientAppointments,
    };
  }

  async getAllAppointments(
    term: string,
    page: number = 1,
    sortBy: string = 'appointmentStatus',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    filterStatus?: 'Scheduled' | 'Missed' | 'On-going' | 'Cancelled' | 'Patient-IN',
    startDate: string = '2021-01-01',
    endDate: string = '2300-01-01',
    perPage: number = 5,
  ): Promise<{
    data: Appointments[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }> {
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);
    const skip = (page - 1) * perPage;

    const appointmentsQueryBuilder = this.appointmentsRepository
      .createQueryBuilder('appointments')
      .innerJoinAndSelect('appointments.patient', 'patient')
      .select([
        'appointments.uuid',
        'appointments.appointmentTime',
        'appointments.appointmentStatus',
        'appointments.appointmentEndTime',
        'appointments.appointmentDate',
        'patient.uuid',
        'patient.firstName',
        'patient.lastName',
        'patient.middleName',
      ])

      .where('appointments.appointmentDate >= :startDate', {
        startDate: startDate,
      })
      .andWhere('appointments.appointmentDate <= :endDate', {
        endDate: endDate,
      })
      .orderBy(`appointments.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (filterStatus) {
      appointmentsQueryBuilder.andWhere('appointments.appointmentStatus = :filterStatus', { filterStatus: filterStatus })
    }


    if (term !== '') {
      console.log('term', term);
      const searchTerms = term.trim().toLowerCase().split(/\s+/);

      appointmentsQueryBuilder
        .where(
          new Brackets((qb) => {
            qb.andWhere('appointments.uuid ILIKE :searchTerm', { searchTerm: `%${term}%` })
              .orWhere('appointments.appointmentStatus ILIKE :searchTerm', { searchTerm: `%${term}%` })
              .orWhere('appointments.details ILIKE :searchTerm', { searchTerm: `%${term}%` });
          })
        )
        .orWhere(
          new Brackets((qb) => {
            if (searchTerms.length > 1) {
              const firstNameTerm = searchTerms.slice(0, -1).join(' ');
              const lastNameTerm = searchTerms[searchTerms.length - 1];
              const fullNameTerm = searchTerms.join(' ');
              console.log('FIRSTZZ', firstNameTerm);
              console.log('lastNameTerm', lastNameTerm);
              console.log('fullNameTerm', fullNameTerm);
              qb.andWhere(
                new Brackets((subQb) => {
                  subQb
                    .where('LOWER(patient.firstName) LIKE :firstNameTerm', { firstNameTerm: `%${firstNameTerm}%` })
                    .andWhere('LOWER(patient.lastName) LIKE :lastNameTerm', { lastNameTerm: `%${lastNameTerm}%` });
                })
              ).orWhere(
                new Brackets((subQb) => {
                  subQb
                    .where('LOWER(patient.firstName) LIKE :fullNameTerm', { fullNameTerm: `%${fullNameTerm}%` })
                    .orWhere('LOWER(patient.lastName) LIKE :fullNameTerm', { fullNameTerm: `%${fullNameTerm}%` });
                })
              ).orWhere(
                new Brackets((subQb) => {
                  subQb
                    .where('LOWER(CONCAT(patient.firstName, patient.lastName)) = :fullNameTerm', { fullNameTerm: `${fullNameTerm}` })
                    .orWhere('LOWER(CONCAT(patient.firstName, \' \', patient.lastName)) = :fullNameTerm', { fullNameTerm: `${fullNameTerm}` });
                })
              );
            } else {
              for (const word of searchTerms) {
                qb.andWhere(
                  new Brackets((subQb) => {
                    subQb
                      .where('LOWER(patient.firstName) ILIKE :word', { word: `%${word}%` })
                      .orWhere('LOWER(patient.lastName) ILIKE :word', { word: `%${word}%` });
                  })
                );
              }
            }
          })
        );
    }


    const appointmentsList = await appointmentsQueryBuilder.getRawMany();

    const totalPatientAppointments = await appointmentsQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientAppointments / perPage);

    return {
      data: appointmentsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientAppointments,
    };
  }

  async updateAppointment(
    id: string,
    updateLabResultsInput: UpdateAppointmentsInput,
  ): Promise<Appointments> {
    const { ...updateData } = updateLabResultsInput;
    const labResults = await this.appointmentsRepository.findOne({
      where: { uuid: id },
    });
    if (!Appointments) {
      throw new NotFoundException(`Lab Result ID-${id}  not found.`);
    }
    Object.assign(labResults, updateData);
    return this.appointmentsRepository.save(labResults);
  }

  async softDeleteAppointment(
    id: string,
  ): Promise<{ message: string; deletedLabResult: Appointments }> {
    const appointments = await this.appointmentsRepository.findOne({
      where: { uuid: id },
    });
    if (!Appointments) {
      throw new NotFoundException(`Appointment ID-${id} does not exist.`);
    }
    appointments.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedLabResult =
      await this.appointmentsRepository.save(appointments);

    return {
      message: `Appointment with ID ${id} has been soft-deleted.`,
      deletedLabResult,
    };
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
      if (
        formattedDate == appointment.appointmentDate &&
        currentTimeFormatted <= appointment.appointmentEndTime
      ) {
        appointment.appointmentStatus = 'ongoing';
      } else if (
        currentTimeFormatted > appointment.appointmentEndTime &&
        appointment.appointmentStatus !== 'Successful'
      ) {
        appointment.appointmentStatus = 'Missed';
      }
      console.log('Current Time:', currentTimeFormatted); // Log current time

      return this.appointmentsRepository.save(appointment);
    }
  }
  async markAppointmentAsSuccessful(id: string) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { uuid: id },
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    appointment.appointmentStatus = 'Successful';
    await this.appointmentsRepository.save(appointment);
  }
}
