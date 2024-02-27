import { Injectable } from '@nestjs/common';
import { CreateVitalSignInput } from './dto/create-vital_sign.input';
import { UpdateVitalSignInput } from './dto/update-vital_sign.input';

@Injectable()
export class VitalSignsService {
  create(createVitalSignInput: CreateVitalSignInput) {
    return 'This action adds a new vitalSign';
  }

  findAll() {
    return `This action returns all vitalSigns`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vitalSign`;
  }

  update(id: number, updateVitalSignInput: UpdateVitalSignInput) {
    return `This action updates a #${id} vitalSign`;
  }

  remove(id: number) {
    return `This action removes a #${id} vitalSign`;
  }
}
