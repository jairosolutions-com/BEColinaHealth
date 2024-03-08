import { Injectable } from '@nestjs/common';
import { CreateEmergencyContactsInput } from './dto/create-emergencyContacts.input';
import { UpdateEmergencyContactsInput } from './dto/update-emergencyContacts.input';

@Injectable()
export class EmergencyContactsService {
  create(createEmergencyContactsInput: CreateEmergencyContactsInput) {
    return 'This action adds a new emergencyContact';
  }

  findAll() {
    return `This action returns all emergencyContact`;
  }

  findOne(id: number) {
    return `This action returns a #${id} emergencyContact`;
  }

  update(id: number, updateEmergencyContactsInput: UpdateEmergencyContactsInput) {
    return `This action updates a #${id} emergencyContact`;
  }

  remove(id: number) {
    return `This action removes a #${id} emergencyContact`;
  }
}
