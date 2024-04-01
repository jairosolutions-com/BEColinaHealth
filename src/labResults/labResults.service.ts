import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLabResultInput } from './dto/create-labResults.input';
import { UpdateLabResultInput } from './dto/update-labResults.input';
import { LabResults } from './entities/labResults.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Repository, ILike, Brackets } from 'typeorm';
import { Patients } from 'src/patients/entities/patients.entity';

@Injectable()
export class LabResultsService {
  constructor(
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    @InjectRepository(LabResults)
    private labResultsRepository: Repository<LabResults>,



    private idService: IdService, // Inject the IdService
  ) { }
  async createLabResults(patientUuid: string, labResultData: CreateLabResultInput): Promise<LabResults> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ["id"],
      where: { uuid: patientUuid }
    });

    const newLabResults = new LabResults();
    const uuidPrefix = 'LBR-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newLabResults.uuid = uuid;
    newLabResults.patientId = patientId; // Assign patientId
    Object.assign(newLabResults, labResultData);
    const savedLabResult = await this.labResultsRepository.save(newLabResults);
    const result = { ...savedLabResult };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;
    return (result)
  }

  async getAllLabResultsWithPatients(): Promise<LabResults[]> {
    return this.labResultsRepository
      .createQueryBuilder('labResults')
      .leftJoinAndSelect('labResults.patient', 'patient') // Left join with Patients table
      .getMany();
  }

  async getAllLabResultsByPatient(
    term: string,
    patientUuid: string,
    page: number = 1,
    sortBy: string = 'date',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5,
  ): Promise<{ data: LabResults[], totalPages: number, currentPage: number, totalCount }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const skip = (page - 1) * perPage;
   
    const patientExists = await this.patientsRepository.findOne({ where: { uuid: patientUuid } });

    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
    const labResultsQueryBuilder = this.labResultsRepository
      .createQueryBuilder('labResults')
      .leftJoinAndSelect('labResults.patient', 'patient')
      .select([
      'labResults.uuid',
      'labResults.createdAt',
      'labResults.hemoglobinA1c',
      'labResults.fastingBloodGlucose',
      'labResults.totalCholesterol',
      'labResults.ldlCholesterol',
      'labResults.hdlCholesterol',
      'labResults.triglycerides',
      'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .orderBy(`labResults.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
      if (term !== "") {
        console.log("term", term);
        labResultsQueryBuilder
          .where(new Brackets((qb) => {
            qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid })
          }))
          .andWhere(new Brackets((qb) => {
            qb.andWhere("labResults.uuid ILIKE :searchTerm", { searchTerm })
              .orWhere("labResults.date ILIKE :searchTerm", { searchTerm })
          }));
      }
    // Get lab results
    const labResultsList = await labResultsQueryBuilder.getRawMany();

    
    const totalPatientLabResults = await labResultsQueryBuilder.getCount();
    console.log('COUNTED', totalPatientLabResults);

    const totalPages = Math.ceil(totalPatientLabResults / perPage);

    return {
      data: labResultsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientLabResults,
    };
  }

  async getAllLabResults(): Promise<LabResults[]> {
    const medicationLogs = await this.labResultsRepository.find();
    return medicationLogs;
  }
  async updateLabResults(
    id: string,
    updateLabResultsInput: UpdateLabResultInput,
  ): Promise<LabResults> {
    const { ...updateData } = updateLabResultsInput;
    const labResults = await this.labResultsRepository.findOne({
      where: { uuid: id },
    });
    if (!labResults) {
      throw new NotFoundException(`Lab Result ID-${id}  not found.`);
    }
    Object.assign(labResults, updateData);
    return this.labResultsRepository.save(labResults);
  }
  async softDeleteLabResults(id: string): Promise<{ message: string, deletedLabResult: LabResults }> {

    // Find the patient record by ID
    const labResults = await this.labResultsRepository.findOne({
      where: { uuid: id },
    });

    if (!labResults) {
      throw new NotFoundException(`Lab Result ID-${id} does not exist.`);
    }

    // Set the deletedAt property to mark as soft deleted
    labResults.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedLabResult = await this.labResultsRepository.save(labResults);

    return {
      message: `Lab Result with ID ${id} has been soft-deleted.`,
      deletedLabResult,
    };
  }
}
