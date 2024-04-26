import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { Equal, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { In } from 'typeorm';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';
import { IdService } from 'services/uuid/id.service';
import { CreateMedicationLogsInput } from 'src/medicationLogs/dto/create-medicationLogs.input';

@Injectable()
export class CronjobsService {
  constructor(
    @InjectRepository(Appointments)
    private appointmentsRepository: Repository<Appointments>,
    @InjectRepository(Prescriptions)
    private prescriptionsRepository: Repository<Prescriptions>,
    @InjectRepository(MedicationLogs)
    private medicationLogsRepository: Repository<MedicationLogs>,
    private idService: IdService,
  ) {}

  @Cron('* */60 * * *') // Cron job to check appointments every minute
  async checkDailyAppointments() {
      const currentDateTime = DateTime.local(); // Get current date and time using Luxon

      const formattedDate = currentDateTime.toFormat('yyyy-MM-dd');
      console.log('Checking appointments for date:', formattedDate);
      console.log('currentDate now', currentDateTime);

      const appointments = await this.appointmentsRepository.find({
          where: {
              appointmentDate: formattedDate,
              appointmentStatus: In(['Scheduled', 'On-going', 'Patient-IN']),
          },
      });

      for (const appointment of appointments) {
          const appointmentDateTime = this.parseDateTime(appointment.appointmentDate, appointment.appointmentTime);
          const appointmentEndDateTime = this.parseDateTime(appointment.appointmentDate, appointment.appointmentEndTime);
          console.log('appointmentDateTime:', appointmentDateTime);
          console.log('appointmentEndDateTime:', appointmentEndDateTime);
          console.log('currentDateTime:', currentDateTime);
          if (currentDateTime > appointmentDateTime && currentDateTime < appointmentEndDateTime) {
              if (appointment.appointmentStatus === 'Scheduled') {
                await this.updateAppointmentStatus(appointment, 'On-going');
                console.log('Marked ongoing for appointment:', appointment.id);
              } else if (appointment.appointmentStatus === 'On-going') {
                console.log('Appointment already ongoing:', appointment.id);
              } else if (appointment.appointmentStatus === 'Patient-IN') {
                console.log('Patient already checked in:', appointment.id);
              }
            } else if (currentDateTime > appointmentEndDateTime) {
              if (appointment.appointmentStatus === 'On-going') {
                await this.updateAppointmentStatus(appointment, 'Missed');
                console.log('Marked missed for appointment:', appointment.id);
              } else if (appointment.appointmentStatus === 'Patient-IN') {
                await this.updateAppointmentStatus(appointment, 'Done');
                console.log('Marked Done for appointment:', appointment.id);
              } else if (appointment.appointmentStatus === 'Scheduled') {
                await this.updateAppointmentStatus(appointment, 'Missed');
                console.log('Marked missed for appointment:', appointment.id);
              }
            } else if (currentDateTime < appointmentDateTime && appointment.appointmentStatus !== 'Done') {
              await this.updateAppointmentStatus(appointment, 'Scheduled');
              console.log('Marked scheduled for appointment:', appointment.id);
            }
      }
  }

  // @Cron('* * * * *') // Cron job to check appointments every minute
  // async checkDailyAppointments() {
  //     const currentDateTime = DateTime.local(); // Get current date and time using Luxon
  //     const formattedDate = currentDateTime.toFormat('yyyy-MM-dd');
  //     console.log('Checking appointments for date:', formattedDate);

  //     const appointments = await this.appointmentsRepository.find({
  //         where: {
  //             appointmentDate: formattedDate,
  //             appointmentStatus: 'scheduled' || 'ongoing',
  //         },
  //     });

  //     for (const appointment of appointments) {
  //         const appointmentDateTime = this.parseDateTime(appointment.appointmentDate, appointment.appointmentTime);
  //         const appointmentEndDateTime = this.parseDateTime(appointment.appointmentDate, appointment.appointmentEndTime);
  //         console.log('appointmentDateTime:', appointmentDateTime);
  //         console.log('appointmentEndDateTime:', appointmentEndDateTime);
  //         console.log('currentDateTime:', currentDateTime);
  //         if (currentDateTime >= appointmentDateTime && currentDateTime <= appointmentEndDateTime) {
  //             await this.updateAppointmentStatus(appointment, 'ongoing');
  //             console.log('Marked ongoing for appointment:', appointment.id);
  //         } else if (currentDateTime > appointmentEndDateTime) {
  //             if (appointment.appointmentStatus !== 'successful') {
  //                 await this.updateAppointmentStatus(appointment, 'missed');
  //                 console.log('Marked missed for appointment:', appointment.id);
  //             }
  //         } else {
  //             if (appointment.appointmentStatus !== 'successful') {
  //                 await this.updateAppointmentStatus(appointment, 'scheduled');
  //                 console.log('Marked scheduled for appointment:', appointment.id);
  //             }
  //         }
  //     }
  // }

  async updateAppointmentStatus(appointment: Appointments, status: string) {
    appointment.appointmentStatus = status;
    await this.appointmentsRepository.save(appointment);
  }

  // parseDateTime(dateString: string, timeString: string): DateTime {
  //     const [year, month, day] = dateString.split('-').map(Number);
  //     const [hoursString, minutesString] = timeString.split(":");
  //     let hours = parseInt(hoursString, 10);
  //     const minutes = parseInt(minutesString.substring(0, 2), 10);
  //     const isPM = timeString.endsWith("PM");

  //     if (isPM && hours !== 12) {
  //         hours += 12;
  //     } else if (!isPM && hours === 12) {
  //         hours = 0;
  //     }

  //     return DateTime.fromObject({
  //         year,
  //         month,
  //         day,
  //         hour: hours,
  //         minute: minutes,
  //     });
  // }
  parseDateTime(dateString: string, timeString: string): DateTime {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hoursString, minutesString] = timeString.split(':');
    const hours = parseInt(hoursString, 10);
    const minutes = parseInt(minutesString, 10);

    // Create a Luxon DateTime object for the appointment
    const appointmentDateTime = DateTime.fromObject({
      year,
      month,
      day,
      hour: hours,
      minute: minutes,
    });

    // Return the appointment DateTime object
    return appointmentDateTime;
  }

  ///

  // @Cron('*/5 * * * * *') // Cron job to run every 5 seconds
  async checkDailyPrescription(medicationLogData: CreateMedicationLogsInput) {
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);

    console.log('currentDate now', todayDate);

    const prescriptions = await this.prescriptionsRepository.find({
      select: ['patientId', 'id', 'frequency', 'name', 'interval'],
      where: {
        status: 'active',
      },
    });

    console.log('prescriptions', prescriptions);

    if (prescriptions && prescriptions.length > 0) {
      for (const prescription of prescriptions) {
        const medlogs = await this.medicationLogsRepository.find({
          select: [
            'patientId',
            'prescriptionId',
            'medicationLogStatus',
            'medicationLogsName',
          ],
          where: {
            createdAt: MoreThanOrEqual(todayDate.toISOString()),
            prescriptionId: prescription.id,
            patientId: prescription.patientId,
          },
        });

        console.log('prescription', prescription);
        console.log('medlogs', medlogs);

        // Determine the expected number of logs based on frequency
        let expectedLogs = 0;
        if (prescription.frequency === 'Once Daily') {
          expectedLogs = 1;
        } else if (prescription.frequency === 'Twice Daily') {
          expectedLogs = 2;
        } else if (prescription.frequency === 'Thrice Daily') {
          expectedLogs = 3;
        }

        // Check if the actual number of logs is less than the expected number
        if (medlogs.length < expectedLogs) {
          console.log(
            `Creating medication logs for ${prescription.frequency} prescription...`,
          );
          for (let i = medlogs.length; i < expectedLogs; i++) {
            const newMedicationLogs = new MedicationLogs();
            const uuidPrefix = 'MDL-'; // Customize prefix as needed
            const uuid = this.idService.generateRandomUUID(uuidPrefix);
            newMedicationLogs.uuid = uuid;
            newMedicationLogs.medicationLogsName = prescription.name;
            newMedicationLogs.medicationLogsDate = todayDate
              .toISOString()
              .split('T')[0];
            // Calculate medicationLogsTime based on interval
            newMedicationLogs.medicationLogsTime = this.calculateMedicationTime(
              prescription.frequency,
              i,
              prescription.interval,
            );
            newMedicationLogs.notes = 'Generated by system';
            newMedicationLogs.medicationType = 'ASCH';
            newMedicationLogs.patientId = prescription.patientId;
            newMedicationLogs.prescriptionId = prescription.id;
            newMedicationLogs.medicationLogStatus = 'pending';
            Object.assign(newMedicationLogs, medicationLogData);
            const savedMedicationLogs =
              await this.medicationLogsRepository.save(newMedicationLogs);
            const result = { ...newMedicationLogs };
            delete result.patientId;
            delete result.deletedAt;
            delete result.updatedAt;
            delete result.id;
            console.log('Saved medication logs:', result);
          }
        }
      }
    }
  }

  // Function to calculate medicationLogsTime based on frequency and interval
  calculateMedicationTime(
    frequency: string,
    index: number,
    intervals: string,
  ): string {
    let hour = 8; // Default hour for medicationLogsTime
    const interval = parseInt(intervals); // Default interval in hours

    // Adjust hour based on index and frequency
    if (frequency === 'Twice Daily') {
      hour += index * interval;
    } else if (frequency === 'Thrice Daily') {
      hour += index * interval;
    }

    // Ensure hour is within 0-23 range
    hour = hour % 24;

    // Convert hour to string format with leading zeros if necessary
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;

    return `${hourStr}:00`;
  }

  // for (const appointment of appointments) {
  //   const appointmentDateTime = this.parseDateTime(
  //     appointment.appointmentDate,
  //     appointment.appointmentTime,
  //   );
  //   const appointmentEndDateTime = this.parseDateTime(
  //     appointment.appointmentDate,
  //     appointment.appointmentEndTime,
  //   );
  //   console.log('appointmentDateTime:', appointmentDateTime);
  //   console.log('appointmentEndDateTime:', appointmentEndDateTime);
  //   console.log('currentDateTime:', currentDateTime);
  //   if (
  //     currentDateTime > appointmentDateTime &&
  //     currentDateTime < appointmentEndDateTime
  //   ) {
  //     if (appointment.appointmentStatus === 'Scheduled') {
  //       await this.updateAppointmentStatus(appointment, 'On-going');
  //       console.log('Marked ongoing for appointment:', appointment.id);
  //     } else if (appointment.appointmentStatus === 'On-going') {
  //       console.log('Appointment already ongoing:', appointment.id);
  //     } else if (appointment.appointmentStatus === 'Patient-IN') {
  //       console.log('Patient already checked in:', appointment.id);
  //     }
  //   } else if (currentDateTime > appointmentEndDateTime) {
  //     if (appointment.appointmentStatus === 'On-going') {
  //       await this.updateAppointmentStatus(appointment, 'Missed');
  //       console.log('Marked missed for appointment:', appointment.id);
  //     } else if (appointment.appointmentStatus === 'Patient-IN') {
  //       await this.updateAppointmentStatus(appointment, 'Done');
  //       console.log('Marked Done for appointment:', appointment.id);
  //     } else if (appointment.appointmentStatus === 'Scheduled') {
  //       await this.updateAppointmentStatus(appointment, 'Missed');
  //       console.log('Marked missed for appointment:', appointment.id);
  //     }
  //   } else if (
  //     currentDateTime < appointmentDateTime &&
  //     appointment.appointmentStatus !== 'Done'
  //   ) {
  //     await this.updateAppointmentStatus(appointment, 'Scheduled');
  //     console.log('Marked scheduled for appointment:', appointment.id);
  //   }
  // }
}
