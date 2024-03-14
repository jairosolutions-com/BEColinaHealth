import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabResultInput } from './dto/create-labResults.input';
import { UpdateLabResultInput } from './dto/update-labResults.input';
import { LabResults } from './entities/labResults.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Repository, ILike } from 'typeorm';
import { Patients } from 'src/patients/entities/patients.entity';

@Injectable()
export class LabResultsService {
  constructor(
    @InjectRepository(LabResults)
    private labResultsRepository: Repository<LabResults>,
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,


    private idService: IdService, // Inject the IdService
  ) { }
  async createLabResults(input: CreateLabResultInput):
    Promise<LabResults> {
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
      throw new ConflictException('MedicationLogs already exists.');
    }
    const newLabResults = new LabResults();
    const uuidPrefix = 'LBR-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newLabResults.uuid = uuid;

    Object.assign(newLabResults, input);
    return this.labResultsRepository.save(newLabResults);

  }

  async getAllLabResultsByPatient(patientUuid: string, page: number = 1, sortBy: string = 'medicationLogsDate', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: LabResults[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ["id"],
      where: { uuid: patientUuid }
    });

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
    const medicationLogs = await this.labResultsRepository.find();
    return medicationLogs;
  }
  async updateLabResults(id: string,
    updateLabResultsInput: UpdateLabResultInput,
  ): Promise<LabResults> {
    const { ...updateData } = updateLabResultsInput;
    const labResults = await this.labResultsRepository.findOne({ where: { uuid: id } });
    if (!labResults) {
      throw new NotFoundException(`Lab Result ID-${id}  not found.`);
    }
    Object.assign(labResults, updateData);
    return this.labResultsRepository.save(labResults);
  }
  async softDeleteLabResults(id: string): Promise<{ message: string, deletedLabResult: LabResults }> {
    // Find the patient record by ID
    const labResults = await this.labResultsRepository.findOne({ where: { uuid: id } });

    if (!labResults) {
      throw new NotFoundException(`Lab Result ID-${id} does not exist.`);
    }

    // Set the deletedAt property to mark as soft deleted
    labResults.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedLabResult = await this.labResultsRepository.save(labResults);

    return { message: `Lab Result with ID ${id} has been soft-deleted.`, deletedLabResult };

  }
}