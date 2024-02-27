import { Injectable } from '@nestjs/common';
import { CreateLabResultInput } from './dto/create-lab_result.input';
import { UpdateLabResultInput } from './dto/update-lab_result.input';

@Injectable()
export class LabResultsService {
  create(createLabResultInput: CreateLabResultInput) {
    return 'This action adds a new labResult';
  }

  findAll() {
    return `This action returns all labResults`;
  }

  findOne(id: number) {
    return `This action returns a #${id} labResult`;
  }

  update(id: number, updateLabResultInput: UpdateLabResultInput) {
    return `This action updates a #${id} labResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} labResult`;
  }
}
