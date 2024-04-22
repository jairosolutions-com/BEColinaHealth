import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Forms } from './entities/form.entity';
import { Brackets, Repository } from 'typeorm';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Forms)
    private formsRepository: Repository<Forms>,

    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,

    private idService: IdService, // Inject the IdService
  ) {}

  async createForm(
    patientUuid: string,
    formsData: CreateFormDto,
  ): Promise<Forms> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ['id'],
      where: { uuid: patientUuid },
    });
    const newForm = new Forms();
    const uuidPrefix = 'FID-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newForm.uuid = uuid;
    newForm.patientId = patientId;
    Object.assign(newForm, formsData);
    const savedForm = await this.formsRepository.save(newForm);
    const result = { ...savedForm };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;
    return result;
  }

  async getAllFormsByPatient(
    patientUuid: string,
    term: string,
    page: number = 1,
    sortBy: string = 'nameOfDocument',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5,
  ): Promise<{
    data: Forms[];
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
    const formsQueryBuilder = this.formsRepository
      .createQueryBuilder('forms')
      .innerJoinAndSelect('forms.patient', 'patient')
      .select([
        'forms.uuid',
        'forms.nameOfDocument',
        'forms.dateIssued',
        'forms.notes',
        'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .orderBy(`forms.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (term !== '') {
      console.log('term', term);
      formsQueryBuilder
        .where(
          new Brackets((qb) => {
            qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid });
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            qb.andWhere('forms.uuid ILIKE :searchTerm', { searchTerm })
              .orWhere('forms.nameOfDocument ILIKE :searchTerm', {
                searchTerm,
              })
              .orWhere('forms.dateIssued ILIKE :searchTerm', {
                searchTerm,
              });
          }),
        );
    }
    const formsResultList = await formsQueryBuilder.getRawMany();
    const totalPatientforms = await formsQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientforms / perPage);
    return {
      data: formsResultList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientforms,
    };
  }

  async updateForm(id: string, updatesFormsDto: UpdateFormDto): Promise<Forms> {
    const { ...updateData } = updatesFormsDto;
    const forms = await this.formsRepository.findOne({
      where: { uuid: id },
    });
    if (!forms) {
      throw new NotFoundException(`Forms  ID-${id}  not found.`);
    }
    Object.assign(forms, updateData);
    const updatedForms = await this.formsRepository.save(forms);
    delete updatedForms.patientId;
    delete updatedForms.deletedAt;
    delete updatedForms.id;
    return updatedForms;
  }

  async softDeleteForm(
    id: string,
  ): Promise<{ message: string; deletedForms: Forms }> {
    const forms = await this.formsRepository.findOne({
      where: { uuid: id },
    });
    if (!forms) {
      throw new NotFoundException(`Form ID-${id} does not exist.`);
    }
    forms.deletedAt = new Date().toISOString();
    const deletedForms =
      await this.formsRepository.save(forms);
      delete deletedForms.patientId;
      delete deletedForms.id;
    return {
      message: `Form with ID ${id} has been soft-deleted.`,
      deletedForms,
    };
  }
}
