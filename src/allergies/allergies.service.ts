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
import { Repository, ILike, createQueryBuilder, Like } from 'typeorm';
import { Patients } from 'src/patients/entities/patients.entity';
import { Brackets } from 'typeorm';

@Injectable()
export class AllergiesService {
  constructor(
    @InjectRepository(Allergies)
    private allergiesRepository: Repository<Allergies>,
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    private idService: IdService, // Inject the IdService
  ) { }

  async createAllergies(patientUuid: string, allergiesData: CreateAllergiesInput): Promise<Allergies> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ["id"],
      where: { uuid: patientUuid }
    });
    const existingAllergy = await this.allergiesRepository.findOne({
      where: {
        allergen: Like(`%${allergiesData.allergen}%`),
        type: Like(`%${allergiesData.type}%`),
        patientId: patientId,
      },
    });
    console.log(allergiesData.patientId,'patientId')
    if (existingAllergy) {
      throw new ConflictException('Allergy with the same type already exists.');

    }

    const newAllergies = new Allergies();
    const uuidPrefix = 'ALG-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newAllergies.uuid = uuid;
    newAllergies.patientId = patientId;
    Object.assign(newAllergies, allergiesData);
    const savedAllergies = await this.allergiesRepository.save(newAllergies);
    const result = { ...savedAllergies };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;
    return (result)

  }

  async getAllAllergiesByPatient(
    patientUuid: string,
    term: string,
    page: number = 1,
    sortBy: string = 'type',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5
  ): Promise<{ data: Allergies[]; totalPages: number; currentPage: number; totalCount: number }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const skip = (page - 1) * perPage;
    const patientExists = await this.patientsRepository.findOne({ where: { uuid: patientUuid } });
    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
    const allergiesQueryBuilder = this.allergiesRepository
      .createQueryBuilder('allergies')
      .innerJoinAndSelect('allergies.patient', 'patient')
      .select([
        'allergies.uuid',
        'allergies.type',
        'allergies.allergen',
        'allergies.severity',
        'allergies.reaction',
        'allergies.notes',
        'allergies.createdAt',
        'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .orderBy(`allergies.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (term !== "") {
      console.log("term", term);
      allergiesQueryBuilder
        .where(new Brackets((qb) => {
          qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid })

        }))
        .andWhere(new Brackets((qb) => {
          qb.andWhere("allergies.allergen ILIKE :searchTerm", { searchTerm })
            .orWhere("allergies.type ILIKE :searchTerm", { searchTerm })
            .orWhere("allergies.uuid ILIKE :searchTerm", { searchTerm })
            .orWhere("allergies.severity ILIKE :searchTerm", { searchTerm })
            .orWhere("allergies.reaction ILIKE :searchTerm", { searchTerm })
            .orWhere("allergies.notes ILIKE :searchTerm", { searchTerm })
            .orWhere("allergies.allergen ILIKE :searchTerm", { searchTerm });
        }))
        ;
    }
    const allergiesList = await allergiesQueryBuilder.getRawMany();
    const totalPatientAllergies = await allergiesQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientAllergies / perPage);
    return {
      data: allergiesList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientAllergies,
    };
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
    allergies.deletedAt = new Date().toISOString();
    const deletedAllergies = await this.allergiesRepository.save(allergies);
    return {
      message: `Allergies with ID ${id} has been soft-deleted.`,
      deletedAllergies,
    };
  }
}
