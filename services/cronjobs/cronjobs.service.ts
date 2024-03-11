import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppointmentsService } from '../../src/appointments/appointments.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CronjobsService {
    constructor(
    @InjectRepository(Appointments)
    private appointmentsRepository: Repository<Appointments>,
    private appointmentService: AppointmentsService) { }
    
    @Cron('* * * * * *')
    checkAppointmentStatus() {

        // this.appointmentService.updateAppointmentStatusDefault();
        console.log("Delicious cakes is open for business...")

    }
}