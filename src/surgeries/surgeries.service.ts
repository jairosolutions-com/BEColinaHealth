import {
  ConflictException,
  Injectable,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { CreateSurgeriesDto } from './dto/create-surgeries.dto';
import { UpdateSurgeriesDto } from './dto/update-surgeries.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Surgeries } from './entities/surgeries.entity';
import { Brackets, ILike, Like, Repository } from 'typeorm';
import { Patients } from 'src/patients/entities/patients.entity';
import { IdService } from 'services/uuid/id.service';

@Injectable()
export class SurgeriesService {
  constructor(
    @InjectRepository(Surgeries)
    private readonly surgeriesRepository: Repository<Surgeries>,
    @InjectRepository(Patients)
    private readonly patientsRepository: Repository<Patients>,
    private idService: IdService,
  ) {}

  async createSurgeries(
    patientUuid: string,
    surgeryData: CreateSurgeriesDto,
  ): Promise<Surgeries> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ['id'],
      where: { uuid: patientUuid },
    });

    const existingSurgery = await this.surgeriesRepository.findOne({
      where: {
        typeOfSurgery: Like(`%${surgeryData.typeOfSurgery}%`),
        surgery: Like(`%${surgeryData.surgery}%`),
        patientId: patientId,
      },
    });
    console.log(patientId, 'patientId');
    if (existingSurgery) {
      throw new ConflictException('Surgery with the same type already exists.');
    }

    const newSurgeries = new Surgeries();
    const uuidPrefix = 'SGY-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newSurgeries.uuid = uuid;
    newSurgeries.patientId = patientId;
    Object.assign(newSurgeries, surgeryData);
    const savedSurgeries = await this.surgeriesRepository.save(newSurgeries);
    const result = { ...savedSurgeries };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;
    return result;
  }
  async getAllSurgeryByPatient(
    patientUuid: string,
    term: string,
    page: number = 1,
    sortBy: string = 'typeOfSurgery',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5,
  ): Promise<{
    data: Surgeries[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const skip = (page - 1) * perPage;
    const patientExists = await this.patientsRepository.findOne({
      where: { uuid: patientUuid },
    });

    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
    const surgeriesQueryBuilder = this.surgeriesRepository
      .createQueryBuilder('surgeries')
      .innerJoinAndSelect('surgeries.patient', 'patient')
      .select([
        'surgeries.uuid',
        'surgeries.typeOfSurgery',
        'surgeries.dateOfSurgery',
        'surgeries.surgery',
        'surgeries.notes',

        'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .orderBy(`surgeries.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (term !== '') {
      console.log('term', term);
      surgeriesQueryBuilder
        .where(
          new Brackets((qb) => {
            qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid });
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            qb.andWhere('surgeries.typeOfSurgery ILIKE :searchTerm', {
              searchTerm,
            })
              .orWhere('surgeries.dateOfSurgery ILIKE :searchTerm', {
                searchTerm,
              })
              .orWhere('surgeries.surgery ILIKE :searchTerm', { searchTerm })
              .orWhere('surgeries.notes ILIKE :searchTerm', { searchTerm })
              .orWhere('surgeries.uuid ILIKE :searchTerm', { searchTerm });
          }),
        );
    }
    const surgeriesResultList = await surgeriesQueryBuilder.getRawMany();
    const totalPatientSurgeries = await surgeriesQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientSurgeries / perPage);
    return {
      data: surgeriesResultList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientSurgeries,
    };
  }
  async updateSurgery(
    id: string,
    updateSurgeriesInput: UpdateSurgeriesDto,
  ): Promise<Surgeries> {
    const { ...updateData } = updateSurgeriesInput;
    const surgeries = await this.surgeriesRepository.findOne({
      where: { uuid: id },
    });
    if (!surgeries) {
      throw new NotFoundException(`Surgery ID-${id}  not found.`);
    }
    Object.assign(surgeries, updateData);
    const updatedSurgery = await this.surgeriesRepository.save(surgeries);
    delete updatedSurgery.patientId;
    delete updatedSurgery.id;
    return updatedSurgery;
  }
  async softDeleteSurgery(
    id: string,
  ): Promise<{ message: string; deletedSurgeries: Surgeries }> {
    // Find the patient record by ID
    const surgeries = await this.surgeriesRepository.findOne({
      where: { uuid: id },
    });

    if (!surgeries) {
      throw new NotFoundException(`Surgery ID-${id} does not exist.`);
    }

    // Set the deletedAt property to mark as soft deleted
    surgeries.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedSurgeries = await this.surgeriesRepository.save(surgeries);

    return {
      message: `Surgery with ID ${id} has been soft-deleted.`,
      deletedSurgeries: deletedSurgeries,
    };
  }
}
