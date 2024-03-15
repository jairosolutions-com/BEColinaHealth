import {
  All,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAllergiesInput } from './dto/create-allergies.dto';
import { UpdateAllergiesInput } from './dto/update-allergies.dto';
import { Allergies } from './entities/allergies.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Repository, ILike } from 'typeorm';

@Injectable()
export class AllergiesService {
  constructor(
    @InjectRepository(Allergies)
    private allergiesRepository: Repository<Allergies>,
    private idService: IdService, // Inject the IdService
  ) {}

  async createAllergies(input: CreateAllergiesInput): Promise<Allergies> {
    const existingLowercaseboth = await this.allergiesRepository.findOne({
      where: {
        allergen: ILike(`%${input.allergen}%`),
        patientId: input.patientId,
      },
    });
    if (existingLowercaseboth) {
      throw new ConflictException('Allergy  already exists.');
    }
    const newAllergies = new Allergies();
    const uuidPrefix = 'ALG-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newAllergies.uuid = uuid;

    Object.assign(newAllergies, input);
    return this.allergiesRepository.save(newAllergies);
  }

  async getAllAllergiesByPatient(
    patientId: string,
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
    const skip = (page - 1) * perPage;
    const totalPatientAllergies = await this.allergiesRepository.count({
      where: { uuid: patientId },
      where: { uuid: patientId },
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientAllergies / perPage);
    const AllergiesList = await this.allergiesRepository.find({
      where: { uuid: patientId },
      where: { uuid: patientId },
      skip: skip,
      take: perPage,
    });
    return {
      data: AllergiesList,
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
