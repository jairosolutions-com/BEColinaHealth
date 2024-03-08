import { Injectable } from '@nestjs/common';
import { CreateAppointmentsInput } from './dto/create-appointments.input';
import { UpdateAppointmentsInput } from './dto/update-appointments.input';

@Injectable()
export class AppointmentsService {
  create(createAppointmentsInput: CreateAppointmentsInput) {
    return 'This action adds a new appointments';
  }

  findAll() {
    return `This action returns all appointments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointments`;
  }

  update(id: number, updateAppointmentsInput: UpdateAppointmentsInput) {
    return `This action updates a #${id} appointments`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointments`;
  }
}
