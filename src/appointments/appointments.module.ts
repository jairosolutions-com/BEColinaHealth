import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsResolver } from './appointments.resolver';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from './entities/appointments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments])],
  providers: [AppointmentsResolver, AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule { }
