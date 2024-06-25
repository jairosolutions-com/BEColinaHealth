import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { AppointmentsService } from '../../src/appointments/appointments.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
const dt = DateTime.local();

@Injectable()
export class CronjobsService {
    constructor(
        @InjectRepository(Appointments)
        private appointmentsRepository: Repository<Appointments>,
        private schedulerRegistry: SchedulerRegistry,
        private readonly appointmentsService: AppointmentsService,
    ) { }

    @Cron('* * * * *') // Cron job to check appointments every minute
    async checkDailyAppointments() {
        const currentDate = new Date();
        const formattedDate = this.formatDate(currentDate);
        console.log('Checking appointments for date:', formattedDate);
        const appointments = await this.appointmentsRepository.find({
            where: {
                // appointmentDate: formattedDate,
            },
        });

        for (const appointment of appointments) {
            const appointmentDateTime = this.parseDateTime(appointment.appointmentDate, appointment.appointmentTime);
            const appointmentEndDateTime = this.parseDateTime(appointment.appointmentDate, appointment.appointmentEndTime);

            if (currentDate >= appointmentDateTime && currentDate <= appointmentEndDateTime) {
                await this.updateAppointmentStatus(appointment, 'On-going');
                console.log('Marked ongoing for appointment:', appointment.id);
            } else if (currentDate > appointmentEndDateTime) {
                if (appointment.appointmentStatus !== 'successful') {
                    await this.updateAppointmentStatus(appointment, 'missed');
                    console.log('Marked missed for appointment:', appointment.id);
                }
            } else {
                if (appointment.appointmentStatus !== 'successful') {
                    await this.updateAppointmentStatus(appointment, 'scheduled');
                    console.log('Marked scheduled for appointment:', appointment.id);
                }
            }
        }
    }

    async updateAppointmentStatus(appointment: Appointments, status: string) {
        appointment.appointmentStatus = status;
        await this.appointmentsRepository.save(appointment);
    }
    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    parseDateTime(dateString: string, timeString: string): Date {
        const [year, month, day] = dateString.split('-').map(Number);
        const [hoursString, minutesString] = timeString.split(":");
        let hours = parseInt(hoursString, 10);
        const minutes = parseInt(minutesString.substring(0, 2), 10);
        const isPM = timeString.endsWith("PM");

        if (isPM && hours !== 12) {
            hours += 12;
        } else if (!isPM && hours === 12) {
            hours = 0;
        }

        return new Date(year, month - 1, day, hours, minutes);
    }
}