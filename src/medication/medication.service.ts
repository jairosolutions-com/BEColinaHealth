import { Injectable } from '@nestjs/common';
import { CreateMedicationInput } from './dto/create-medication.input';
import { UpdateMedicationInput } from './dto/update-medication.input';

@Injectable()
export class MedicationService {
  create(createMedicationInput: CreateMedicationInput) {
    return 'This action adds a new medication';
  }

  findAll() {
    return `This action returns all medication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medication`;
  }

  update(id: number, updateMedicationInput: UpdateMedicationInput) {
    return `This action updates a #${id} medication`;
  }

  remove(id: number) {
    return `This action removes a #${id} medication`;
  }
}
