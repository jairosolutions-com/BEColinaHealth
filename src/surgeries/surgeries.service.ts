import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSurgeriesDto } from './dto/create-surgeries.dto';
import { UpdateSurgeriesDto } from './dto/update-surgeries.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Surgeries } from './entities/surgeries.entity';
import { ILike, Repository } from 'typeorm';
import { Patients } from 'src/patients/entities/patients.entity';
import { IdService } from 'services/uuid/id.service';

@Injectable()
export class SurgeriesService {
  constructor(
    @InjectRepository(Surgeries)
    private readonly surgeriesRepository: Repository<Surgeries>,
    @InjectRepository(Patients)
    private readonly patientRepository: Repository<Patients>,
    private idService: IdService,
  ) {}

  async createAllergies(input: CreateSurgeriesDto): Promise<Surgeries> {
    const patient = await this.patientRepository.findOne({
      where: { uuid: input.patientUuid },
    });

    const existingLowercaseboth = await this.surgeriesRepository.findOne({
      where: {
        typeOfSurgeries: ILike(`%${input.typeOfSurgeries}%`),
        patientId: patient.id,
      },
    });
    if (existingLowercaseboth) {
      throw new ConflictException(
        'A Surgeries with the same type of Surgeries already exists',
      );
    }
    const newSurgeries = new Surgeries();
    const uuidPrefix = 'SGY-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newSurgeries.uuid = uuid;
    newSurgeries.patientId = patient.id;

    Object.assign(newSurgeries, input);
    const createdSurgeries = await this.surgeriesRepository.save(newSurgeries);
    delete createdSurgeries.id;
    delete createdSurgeries.patientId;
    return createdSurgeries;
  }

  async getAllSurgeriesByPatient(
    patientUuid: string,
    page: number = 1,
    sortBy: string = 'dateOfSurgeries',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5,
  ): Promise<{
    data: Surgeries[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    try {
      const skip = (page - 1) * perPage;
      const patient = await this.patientRepository.findOne({
        where: {
          uuid: patientUuid,
        },
      });
      console.log(patient);
      if (!patient) {
        throw new ConflictException('Patient not found');
      }

      const totalPatientSurgeries = await this.surgeriesRepository.count({
        where: {
          patientId: patient.id,
        },
      });

      console.log(totalPatientSurgeries, 'tt', patient.id);

      const totalPages = Math.ceil(totalPatientSurgeries / perPage);
      console.log(totalPages);
      const surgeryList = await this.surgeriesRepository.find({
        select: [
          'uuid',
          'dateOfSurgeries',
          'typeOfSurgeries',
          'surgery',
          'notes',
        ],
        where: {
          patientId: patient.id,
        },
        skip: skip,
        take: perPage,
        order: {
          [sortBy]: sortOrder,
        },
      });
      if (!surgeryList) {
        console.log('error');
      }
      return {
        data: surgeryList,
        totalPages: totalPages,
        currentPage: page,
        totalCount: totalPatientSurgeries,
      };
    } catch (error) {
      throw new NotFoundException(
        'An error occurred while fetching surgeries',
        "Patient with the provided ID doesn't exist",
      );
    }
  }
}
