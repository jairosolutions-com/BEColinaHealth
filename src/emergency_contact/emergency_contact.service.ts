import { Injectable } from '@nestjs/common';
import { CreateEmergencyContactInput } from './dto/create-emergency_contact.input';
import { UpdateEmergencyContactInput } from './dto/update-emergency_contact.input';

@Injectable()
export class EmergencyContactService {
  create(createEmergencyContactInput: CreateEmergencyContactInput) {
    return 'This action adds a new emergencyContact';
  }

  findAll() {
    return `This action returns all emergencyContact`;
  }

  findOne(id: number) {
    return `This action returns a #${id} emergencyContact`;
  }

  update(id: number, updateEmergencyContactInput: UpdateEmergencyContactInput) {
    return `This action updates a #${id} emergencyContact`;
  }

  remove(id: number) {
    return `This action removes a #${id} emergencyContact`;
  }
}
