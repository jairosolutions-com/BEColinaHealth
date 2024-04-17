import { Injectable } from '@nestjs/common';
import { CreateFormFileDto } from './dto/create-formFile.dto';
import { UpdateFormFileDto } from './dto/update-formFile.dto';

@Injectable()
export class FormFilesService {
  create(createFormFileDto: CreateFormFileDto) {
    return 'This action adds a new formFile';
  }

  findAll() {
    return `This action returns all formFiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} formFile`;
  }

  update(id: number, updateFormFileDto: UpdateFormFileDto) {
    return `This action updates a #${id} formFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} formFile`;
  }
}
