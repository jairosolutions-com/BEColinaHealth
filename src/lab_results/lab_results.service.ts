import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabResultInput } from './dto/create-lab_result.input';
import { UpdateLabResultInput } from './dto/update-lab_result.input';
import { LabResults } from './entities/lab_result.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Repository, ILike } from 'typeorm';

@Injectable()
export class LabResultsService {
  constructor(
    @InjectRepository(LabResults)
    private labResultsRepository: Repository<LabResults>,
    private idService: IdService, // Inject the IdService
  ) { }
  async createLabResults(input: CreateLabResultInput):
    Promise< LabResults > {
    const existingLowercaseboth = await this.labResultsRepository.findOne({
      where: {
        hemoglobinA1c: ILike(`%${input.hemoglobinA1c}%`),
        fastingBloodGlucose: ILike(`%${input.fastingBloodGlucose}%`),
        date: ILike(`%${input.date}%`),
        totalCholesterol: ILike(`%${input.ldlCholesterol}%`),
        triglycerides: ILike(`%${input.triglycerides}%`),
        patientId: (input.patientId)
     },
    });
    if (existingLowercaseboth) {
      throw new ConflictException('Medication already exists.');
    }
    const newLabResults = new LabResults();
    const uuidPrefix = 'LBR-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newLabResults.uuid = uuid;

    Object.assign(newLabResults, input);
    return this.labResultsRepository.save(newLabResults);

  }

  async getAllLabResultsByPatient(patientId: number, page: number = 1, sortBy: string = 'medicationDate', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: LabResults[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const totalPatientLabResults = await this.labResultsRepository.count({
      where: { patientId },
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientLabResults / perPage);
    const labResultsList = await this.labResultsRepository.find({
      where: { patientId },
      skip: skip,
      take: perPage,
    });
    return {
      data: labResultsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientLabResults
    };
  }

  async getAllLabResults(): Promise<LabResults[]> {
    const medication = await this.labResultsRepository.find();
    return medication;
  }
  async updateLabResults(id: number,
    updateLabResultsInput: UpdateLabResultInput,
  ): Promise<LabResults> {
    const { ...updateData } = updateLabResultsInput;
    const labResults = await this.labResultsRepository.findOne({ where: { id } });
    if (!labResults) {
      throw new NotFoundException(`Lab Result ID-${id}  not found.`);
    }
    Object.assign(labResults, updateData);
    return this.labResultsRepository.save(labResults);
  }
  async softDeleteLabResults(id: number): Promise<{ message: string, deletedLabResult: LabResults }> {
    // Find the patient record by ID
    const labResults = await this.labResultsRepository.findOne({ where: { id } });

    if (!labResults) {
      throw new NotFoundException(`Lab Result ID-${id} does not exist.`);
    }

    // Set the deleted_at property to mark as soft deleted
    labResults.deleted_at = new Date().toISOString();

    // Save and return the updated patient record
    const deletedLabResult = await this.labResultsRepository.save(labResults);

    return { message: `Lab Result with ID ${id} has been soft-deleted.`, deletedLabResult };

  }
}