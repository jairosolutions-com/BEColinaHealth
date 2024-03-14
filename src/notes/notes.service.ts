import { Injectable } from '@nestjs/common';
import { CreateNotesInput } from './dto/create-notes.input';
import { UpdateNotesInput } from './dto/update-notes.input';

@Injectable()
export class NotesService {
  create(createNotesInput: CreateNotesInput) {
    return 'This action adds a new notes';
  }

  findAll() {
    return `This action returns all notes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notes`;
  }

  update(id: number, updateNotesInput: UpdateNotesInput) {
    return `This action updates a #${id} notes`;
  }

  remove(id: number) {
    return `This action removes a #${id} notes`;
  }
}
