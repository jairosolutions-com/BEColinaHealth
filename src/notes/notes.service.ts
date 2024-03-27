import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotesInput } from './dto/create-notes.input';
import { UpdateNotesInput } from './dto/update-notes.input';
import { Notes } from './entities/notes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Notes)
    private notesRepository: Repository<Notes>,

    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,

    private idService: IdService, // Inject the IdService
  ) {}

  async createNote(
    patientUuid: string,
    notesData: CreateNotesInput,
  ): Promise<Notes> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ['id'],
      where: { uuid: patientUuid },
    });
    const newNotes = new Notes();
    const uuidPrefix = 'NID-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newNotes.uuid = uuid;
    newNotes.patientId = patientId;
    Object.assign(newNotes, notesData);
    const savedVitalSign = await this.notesRepository.save(newNotes);
    const result = { ...savedVitalSign };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;
    return result;
  }

  //PAGED NOTES list PER PATIENT
  async getAllNotesByPatient(
    patientUuid: string,
    term: string,
    page: number = 1,
    sortBy: string = 'subject',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5,
  ): Promise<{
    data: Notes[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const skip = (page - 1) * perPage;
    const patientExists = await this.patientsRepository.findOne({
      where: { uuid: patientUuid },
    });
    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
    const notesQueryBuilder = this.notesRepository
      .createQueryBuilder('notes')
      .innerJoinAndSelect('notes.patient', 'patient')
      .select([
        'notes.uuid',
        'notes.subject',
        'notes.notes',
        'notes.createdAt',
        'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .orderBy(`notes.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (term !== '') {
      console.log('term', term);
      notesQueryBuilder
        .where(
          new Brackets((qb) => {
            qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid });
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            qb.andWhere('notes.uuid ILIKE :searchTerm', { searchTerm })
              .orWhere('notes.subject ILIKE :searchTerm', {
                searchTerm,
              })
              .orWhere('notes.notes ILIKE :searchTerm', {
                searchTerm,
              })
          }),
        );
    }
    const notesResultList = await notesQueryBuilder.getRawMany();
    const totalPatientNotes = await notesQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientNotes / perPage);
    return {
      data: notesResultList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientNotes,
    };
  }

  async updateNote(
    id: string,
    updateNotesInput: UpdateNotesInput,
  ): Promise<Notes> {
    const { ...updateData } = updateNotesInput;
    const notes = await this.notesRepository.findOne({
      where: { uuid: id },
    });
    if (!notes) {
      throw new NotFoundException(`Notes  ID-${id}  not found.`);
    }
    Object.assign(notes, updateData);
    const updatedNotes = await this.notesRepository.save(notes);
    delete updatedNotes.patientId;
    delete updatedNotes.deletedAt;
    delete updatedNotes.id;
    return updatedNotes;
  }
  async softDeleteNotes(
    id: string,
  ): Promise<{ message: string; deletedNotes: Notes }> {
    const notes = await this.notesRepository.findOne({
      where: { uuid: id },
    });
    if (!notes) {
      throw new NotFoundException(`Notes ID-${id} does not exist.`);
    }
    notes.deletedAt = new Date().toISOString();
    const deletedNotes =
      await this.notesRepository.save(notes);
      delete deletedNotes.patientId;
      delete deletedNotes.id;
    return {
      message: `Note with ID ${id} has been soft-deleted.`,
      deletedNotes,
    };
  }
}

