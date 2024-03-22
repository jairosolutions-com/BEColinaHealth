import {
  All,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAllergiesInput } from './dto/create-allergies.dto';
import { UpdateAllergiesInput } from './dto/update-allergies.dto';
import { Allergies } from './entities/allergies.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Repository, ILike, createQueryBuilder } from 'typeorm';
import { Patients } from 'src/patients/entities/patients.entity';

@Injectable()
export class AllergiesService {
  constructor(
    @InjectRepository(Allergies)
    private allergiesRepository: Repository<Allergies>,
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    private idService: IdService, // Inject the IdService
  ) {}

  async createAllergies(input: CreateAllergiesInput): Promise<Allergies> {
    const patient = await this.patientsRepository.findOne({
      where: { uuid: input.patientUuid },
    });

    const existingLowercaseboth = await this.allergiesRepository.findOne({
      where: {
        allergen: ILike(`%${input.allergen}%`),
        patientId: patient.id,
      },
    });
    if (existingLowercaseboth) {
      throw new ConflictException('Allergy already exists.');
    }
    const newAllergies = new Allergies();
    const uuidPrefix = 'ALG-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newAllergies.uuid = uuid;
    newAllergies.patientId = patient.id;

    Object.assign(newAllergies, input);
    const createdAllergies = await this.allergiesRepository.save(newAllergies);
    delete createdAllergies.id;
    delete createdAllergies.patientId;
    return createdAllergies;
  }

  async getAllAllergiesByPatient(
    patientUuid: string,
    page: number = 1,
    sortBy: string = 'type',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5,
  ): Promise<{
    data: Allergies[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    try {
      const skip = (page - 1) * perPage;

      const patient = await this.patientsRepository.findOne({
        where: { uuid: patientUuid },
      });

      console.log('pp', patient);

      if (!patient) {
        throw new NotFoundException('Patient does not exist.');
      }

      const totalPatientAllergies = await this.allergiesRepository.count({
        where: { patientId: patient.id },
      });

      const totalPages = Math.ceil(totalPatientAllergies / perPage);

      console.log('tt', totalPages);

      const AllergiesList = await this.allergiesRepository.find({
        select: [
          'uuid',
          'type',
          'allergen',
          'reaction',
          'severity',
          'notes',
          'createdAt',
        ],
        where: { patientId: patient.id },
        skip: skip,
        take: perPage,
        order: { [sortBy]: sortOrder },
      });
      console.log('al', AllergiesList);
      return {
        data: AllergiesList,
        totalPages: totalPages,
        currentPage: page,
        totalCount: totalPatientAllergies,
      };
    } catch (error) {
      // Handle the error here
      throw new NotFoundException(
        'An error occurred while fetching allergies.',
        "Patient with the provided ID doesn't exist.",
      );
    }
  }

  async searchPatientAllergiesByTerm(
    patientUuid: string,
    term: string,
    page: number = 1,
    sortBy: string = 'allergen',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5,
  ): Promise<{
    data: Allergies[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    //Check if patient exist before searching for allergies
    try {
      const patient = await this.patientsRepository.findOne({
        where: {
          uuid: patientUuid,
        },
      });
      if (!patient) {
        throw new NotFoundException('Patient does not exist.');
      }

      const searchTerm = `%${term}%`; // Add wildcards to the search term
      const skip = (page - 1) * perPage;

      //count the total rows searched
      const totalAllergies = await this.allergiesRepository.count({
        where: [
          {
            allergen: ILike(searchTerm),
            patientId: patient.id, // Filter by patientId
          },
          {
            uuid: ILike(`%${searchTerm}%`),
            patientId: patient.id, // Filter by patientId
          },
        ],
      });
      //total number of pages
      const totalPages = Math.ceil(totalAllergies / perPage);
      console.log('sss', totalAllergies);
      //find the data
      const AllergiesList = await this.allergiesRepository.find({
        select: [
          'uuid',
          'type',
          'allergen',
          'reaction',
          'severity',
          'notes',
          'createdAt',
        ],
        where: [
          {
            allergen: ILike(searchTerm),
            patientId: patient.id, // Filter by patientId
          },
          {
            uuid: ILike(`%${searchTerm}%`),
            patientId: patient.id, // Filter by patientId
          },
        ],
        skip: skip,
        take: perPage,
        order: { [sortBy]: sortOrder },
      });
      // // Convert createdAt to ISO string without time
      // AllergiesList.forEach((allergy) => {
      //   allergy.createdAt = allergy.createdAt.toString().split('T')[0];
      // });
      return {
        data: AllergiesList,
        totalPages: totalPages,
        currentPage: page,
        totalCount: totalAllergies,
      };
    } catch (error) {
      throw new NotFoundException(
        'An error occurred while fetching allergies.',
        "Patient with the provided ID doesn't exist.",
      );
    }
  }

  async getAllAllergies(): Promise<Allergies[]> {
    const allergies = await this.allergiesRepository.find();
    return allergies;
  }
  async updateAllergies(
    id: string,
    updateAllergiesInput: UpdateAllergiesInput,
  ): Promise<Allergies> {
    const { ...updateData } = updateAllergiesInput;
    const allergies = await this.allergiesRepository.findOne({
      where: { uuid: id },
    });
    if (!allergies) {
      throw new NotFoundException(`Allergy ID-${id}  not found.`);
    }
    Object.assign(allergies, updateData);
    return this.allergiesRepository.save(allergies);
  }
  async softDeleteAllergies(
    id: string,
  ): Promise<{ message: string; deletedAllergies: Allergies }> {
    // Find the patient record by ID
    const allergies = await this.allergiesRepository.findOne({
      where: { uuid: id },
    });

    if (!allergies) {
      throw new NotFoundException(`Allergy ID-${id} does not exist.`);
    }

    // Set the deletedAt property to mark as soft deleted
    allergies.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedAllergies = await this.allergiesRepository.save(allergies);

    return {
      message: `Allergies with ID ${id} has been soft-deleted.`,
      deletedAllergies,
    };
  }
}
