// // appointment.scheduler.ts
// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { AppointmentsService } from '../../src/appointments/appointments.service';

// @Injectable()
// export class AppointmentScheduler {
//   constructor(private appointmentService: AppointmentsService) { }
//   private readonly logger = new Logger(AppointmentScheduler.name);


//   @Cron(CronExpression.EVERY_5_SECONDS) // Run every hour
//   async handleCron() {
//     this.logger.log('Cron job running...');

//     await this.appointmentService.updateAppointmentStatusDefault();
//   }
// }