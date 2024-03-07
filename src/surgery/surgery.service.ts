import { Injectable } from '@nestjs/common';
import { CreateSurgeryDto } from './dto/create-surgery.dto';
import { UpdateSurgeryDto } from './dto/update-surgery.dto';

@Injectable()
export class SurgeryService {
  create(createSurgeryDto: CreateSurgeryDto) {
    return 'This action adds a new surgery';
  }

  findAll() {
    return `This action returns all surgery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} surgery`;
  }

  update(id: number, updateSurgeryDto: UpdateSurgeryDto) {
    return `This action updates a #${id} surgery`;
  }

  remove(id: number) {
    return `This action removes a #${id} surgery`;
  }
}
