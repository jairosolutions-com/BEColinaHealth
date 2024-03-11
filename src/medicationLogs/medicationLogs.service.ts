import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicationLogsInput } from './dto/create-medicationLogs.input';
import { UpdateMedicationLogsInput } from './dto/update-medicationLogs.input';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { ILike, Repository } from 'typeorm';
import { MedicationLogs } from './entities/medicationLogs.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';

@Injectable()
export class MedicationLogsService {
  constructor(

    @InjectRepository(MedicationLogs)
    private medicationLogsRepository: Repository<MedicationLogs>,
    @InjectRepository(Prescriptions)
    private readonly prescriptionsRepository: Repository<Prescriptions>,
    private idService: IdService, // Inject the IdService
  ) { }

  async createMedicationLogs(input: CreateMedicationLogsInput):
    Promise<MedicationLogs> {
    var message = "";

    const existingLowercaseboth = await this.medicationLogsRepository.findOne({
      where: {
        medicationName: ILike(`%${input.medicationLogsName}%`),
        medicationDate: ILike(`%${input.medicationLogsDate}%`),
        medicationStatus: ILike(`%${input.medicationLogsStatus}%`),
        medicationTime: ILike(`%${input.medicationLogsTime}%`),
        medicationType: ILike(`%${input.medicationLogsType}%`),
        patientId: (input.patientId)
      },

    });

    if (existingLowercaseboth) {
      throw new ConflictException('MedicationLogs already exists.');
    }

    const newMedicationLogs = new MedicationLogs();


    const uuidPrefix = 'MDL-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newMedicationLogs.uuid = uuid;

    Object.assign(newMedicationLogs, input);
    this.medicationLogsRepository.save(newMedicationLogs);
    return newMedicationLogs;
  }

  async getAllASCHMedicationLogsByPatient(patientId: number, page: number = 1, sortBy: string = 'medicationLogsDate', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: MedicationLogs[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const totalPatientASCHMedicationLogs = await this.medicationLogsRepository.count({
      where: {
        patientId, medicationType: 'ASCH'
      },
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientASCHMedicationLogs / perPage);
    const medicationLogsList = await this.medicationLogsRepository.find({
      where: {
        patientId, medicationType: 'ASCH'
      },
      skip: skip,
      take: perPage,
      order: { [sortBy]: sortOrder } // Apply sorting based on sortBy and sortOrder
    });
    return {
      data: medicationLogsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientASCHMedicationLogs
    };
  }

  async getAllPRNMedicationLogsByPatient(patientId: number, page: number = 1, sortBy: string = 'medicationLogsDate', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: MedicationLogs[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const totalPatientPRNMedicationLogs = await this.medicationLogsRepository.count({
      where: {
        patientId, medicationType: 'PRN'
      },
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientPRNMedicationLogs / perPage);
    const medicationLogsList = await this.medicationLogsRepository.find({
      where: {
        patientId, medicationType: 'PRN'
      },
      skip: skip,
      take: perPage,
      order: { [sortBy]: sortOrder } // Apply sorting based on sortBy and sortOrder
    });
    return {
      data: medicationLogsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientPRNMedicationLogs
    };
  }

  async getAllMedicationLogs(): Promise<MedicationLogs[]> {
    const medicationLogs = await this.medicationLogsRepository.find();
    return medicationLogs;
  }
  async updateMedicationLogs(id: number,
    updateMedicationLogsInput: UpdateMedicationLogsInput,
  ): Promise<MedicationLogs> {
    const { ...updateData } = updateMedicationLogsInput;
    const medicationLogs = await this.medicationLogsRepository.findOne({ where: { id } });
    if (!medicationLogs) {
      throw new NotFoundException(`MedicationLogs ID-${id}  not found.`);
    }
    Object.assign(medicationLogs, updateData);
    return this.medicationLogsRepository.save(medicationLogs);
  }
  async softDeleteMedicationLogs(id: number): Promise<{ message: string, deletedMedicationLogs: MedicationLogs }> {
    // Find the patient record by ID
    const medicationLogs = await this.medicationLogsRepository.findOne({ where: { id } });

    if (!medicationLogs) {
      throw new NotFoundException(`MedicationLogs ID-${id} does not exist.`);
    }

    // Set the deletedAt property to mark as soft deleted
    medicationLogs.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedMedicationLogs = await this.medicationLogsRepository.save(medicationLogs);

    return { message: `MedicationLogs with ID ${id} has been soft-deleted.`, deletedMedicationLogs };

  }
}
