import { All, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAllergyInput } from './dto/create-allergy.dto';
import { UpdateAllergyInput } from './dto/update-allergy.dto';
import { Allergy } from './entities/allergy.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Repository, ILike } from 'typeorm';

@Injectable()
export class AllergyService {
  constructor(
    @InjectRepository(Allergy)
    private allergyRepository: Repository<Allergy>,
    private idService: IdService, // Inject the IdService
  ) { }
  async createAllergy(input: CreateAllergyInput):
    Promise< Allergy > {
    const existingLowercaseboth = await this.allergyRepository.findOne({
      where: {
        type: ILike(`%${input.type}%`),
        reaction: ILike(`%${input.reaction}%`),
        patientId: (input.patientId)
     },
    });
    if (existingLowercaseboth) {
      throw new ConflictException('Medication already exists.');
    }
    const newAllergy = new Allergy();
    const uuidPrefix = 'ALG-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newAllergy.uuid = uuid;

    Object.assign(newAllergy, input);
    return this.allergyRepository.save(newAllergy);

  }

  async getAllAllergyByPatient(patientId: number, page: number = 1, sortBy: string = 'type', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: Allergy[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const totalPatientAllergy= await this.allergyRepository.count({
      where: { patientId },
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientAllergy / perPage);
    const AllergyList = await this.allergyRepository.find({
      where: { patientId },
      skip: skip,
      take: perPage,
    });
    return {
      data: AllergyList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientAllergy
    };
  }

  async getAllLabResults(): Promise<Allergy[]> {
    const allergy = await this.allergyRepository.find();
    return allergy;
  }
  async updateAllergy(id: number,
    updateAllergyInput: UpdateAllergyInput,
  ): Promise<Allergy> {
    const { ...updateData } = updateAllergyInput;
    const allergy = await this.allergyRepository.findOne({ where: { id } });
    if (!allergy) {
      throw new NotFoundException(`Lab Result ID-${id}  not found.`);
    }
    Object.assign(allergy, updateData);
    return this.allergyRepository.save(allergy);
  }
  async softDeleteAllergy(id: number): Promise<{ message: string, deletedAllergy: Allergy }> {
    // Find the patient record by ID
    const allergy = await this.allergyRepository.findOne({ where: { id } });

    if (!allergy) {
      throw new NotFoundException(`Lab Result ID-${id} does not exist.`);
    }

    // Set the deleted_at property to mark as soft deleted
    allergy.deleted_at = new Date().toISOString();

    // Save and return the updated patient record
    const deletedAllergy = await this.allergyRepository.save(allergy);

    return { message: `Allergy with ID ${id} has been soft-deleted.`, deletedAllergy };

  }
}
