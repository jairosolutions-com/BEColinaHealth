import { Injectable } from '@nestjs/common';
import { CreateMedicalHistoryInput } from './dto/create-medical_history.input';
import { UpdateMedicalHistoryInput } from './dto/update-medical_history.input';

@Injectable()
export class MedicalHistoryService {
  create(createMedicalHistoryInput: CreateMedicalHistoryInput) {
    return 'This action adds a new medicalHistory';
  }

  findAll() {
    return `This action returns all medicalHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medicalHistory`;
  }

  update(id: number, updateMedicalHistoryInput: UpdateMedicalHistoryInput) {
    return `This action updates a #${id} medicalHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicalHistory`;
  }
}
