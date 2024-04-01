import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMedicationLogsInput } from './dto/create-medicationLogs.input';
import { UpdateMedicationLogsInput } from './dto/update-medicationLogs.input';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Brackets, ILike, Repository } from 'typeorm';
import { MedicationLogs } from './entities/medicationLogs.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { Patients } from 'src/patients/entities/patients.entity';

@Injectable()
export class MedicationLogsService {
  constructor(
    @InjectRepository(MedicationLogs)
    private medicationLogsRepository: Repository<MedicationLogs>,
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,

    private idService: IdService, // Inject the IdService
  ) {}

  async createMedicationLogs(patientUuid: string,medicationLogData: CreateMedicationLogsInput):
    Promise<MedicationLogs> {
    var message = "";
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ["id"],
      where: { uuid: patientUuid }
    });
    const existingMedicationLog = await this.medicationLogsRepository.findOne({
      where: {
        medicationLogsName: ILike(`${medicationLogData.medicationLogsName}`),
        medicationLogsDate: ILike(`${medicationLogData.medicationLogsDate}`),
        medicationLogStatus: ILike(`${medicationLogData.medicationLogStatus}`),
        medicationLogsTime: ILike(`${medicationLogData.medicationLogsTime}`),
        medicationType: ILike(`${medicationLogData.medicationType}`),
        patientId: medicationLogData.patientId
      },
    });

    if (existingMedicationLog) {
      throw new ConflictException('MedicationLogs already exists.');
    }
    const newMedicationLogs = new MedicationLogs();
    const uuidPrefix = 'MDL-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newMedicationLogs.uuid = uuid;
    newMedicationLogs.patientId = patientId;
    Object.assign(newMedicationLogs, medicationLogData);
    const savedVitalSign = await this.medicationLogsRepository.save(newMedicationLogs);
    const result = { ...savedVitalSign };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;
    return (result)
  }
  async getAllASCHMedicationLogsByPatient(
    patientUuid: string,
    term: string,
    page: number = 1,
    sortBy: string = 'medicationLogsDate',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5
  ): Promise<{ data: MedicationLogs[]; totalPages: number; currentPage: number; totalCount: number }> {
    const skip = (page - 1) * perPage;
    const searchTerm = `%${term}%`;
    const patientExists = await this.patientsRepository.findOne({ where: { uuid: patientUuid } });
    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
    const aschMedicationQueryBuilder = this.medicationLogsRepository
      .createQueryBuilder('medicationlogs')
      .innerJoinAndSelect('medicationlogs.patient', 'patient')
      .select([
        'medicationlogs.uuid',
        'medicationlogs.medicationLogsName',
        'medicationlogs.notes',
        'medicationlogs.medicationType',
        'medicationlogs.medicationLogsDate',
        'medicationlogs.medicationLogsTime',
        'medicationlogs.medicationLogStatus',
        'patient.uuid'
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .orderBy(`medicationlogs.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (term !== "") {
      console.log("term", term);
      aschMedicationQueryBuilder
        .where(new Brackets((qb) => {
          qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid })
            .andWhere('medicationlogs.medicationType = :medicationType', { medicationType: 'ASCH' });
        }))
        .andWhere(new Brackets((qb) => {
          qb.andWhere("medicationlogs.medicationLogsName ILIKE :searchTerm", { searchTerm })
            .orWhere("medicationlogs.medicationLogStatus ILIKE :searchTerm", { searchTerm })
            .orWhere("medicationlogs.uuid ILIKE :searchTerm", { searchTerm });
        }));
    } else {
      aschMedicationQueryBuilder
        .where('patient.uuid = :uuid', { uuid: patientUuid })
        .andWhere('medicationlogs.medicationType = :medicationType', { medicationType: 'ASCH' });
    }
    const aschMedicationList = await aschMedicationQueryBuilder.getRawMany();
    const totalPatientASCHMedication = await aschMedicationQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientASCHMedication / perPage);

    return {
      data: aschMedicationList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientASCHMedication,
    };
  }
  // async getAllASCHMedicationLogsByPatient(patientUuid: string, page: number = 1, sortBy: string = 'medicationLogsDate', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: MedicationLogs[], totalPages: number, currentPage: number, totalCount }> {
  //   const skip = (page - 1) * perPage;

  //   const { id: patientId } = await this.patientsRepository.findOne({
  //     select: ["id"],
  //     where: { uuid: patientUuid }
  //   });

  //   const totalPatientASCHMedicationLogs = await this.medicationLogsRepository.count({
  //     where: {
  //       patientId, medicationType: 'ASCH'
  //     },
  //   });
  //   const totalPages = Math.ceil(totalPatientASCHMedicationLogs / perPage);

  //   const medicationLogsList = await this.medicationLogsRepository.find({
  //     where: {
  //       patientId, medicationType: 'ASCH'
  //     },
  //     skip: skip,
  //     take: perPage,
  //     order: { [sortBy]: sortOrder } // Apply sorting based on sortBy and sortOrder
  //   });
  //   return {
  //     data: medicationLogsList,
  //     totalPages: totalPages,
  //     currentPage: page,
  //     totalCount: totalPatientASCHMedicationLogs
  //   };
  // }
  async getAllPRNMedicationLogsByPatient(
    patientUuid: string,
    term: string,
    page: number = 1,
    sortBy: string = 'medicationLogsDate',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5
  ): Promise<{ data: MedicationLogs[]; totalPages: number; currentPage: number; totalCount: number }> {
    const skip = (page - 1) * perPage;
    const searchTerm = `%${term}%`;
    const patientExists = await this.patientsRepository.findOne({ where: { uuid: patientUuid } });
    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
    const prnMedicationQueryBuilder = this.medicationLogsRepository
      .createQueryBuilder('medicationlogs')
      .innerJoinAndSelect('medicationlogs.patient', 'patient')
      .select([
        'medicationlogs.uuid',
        'medicationlogs.medicationLogsName',
        'medicationlogs.notes',
        'medicationlogs.medicationType',
        'medicationlogs.medicationLogsDate',
        'medicationlogs.medicationLogsTime',
        'medicationlogs.medicationLogStatus',
        'patient.uuid'
      ])
      .orderBy(`medicationlogs.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (term !== "") {
      console.log("term", term);
      prnMedicationQueryBuilder
        .where(new Brackets((qb) => {
          qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid })
            .andWhere('medicationlogs.medicationType = :medicationType', { medicationType: 'PRN' });
        }))
        .andWhere(new Brackets((qb) => {
          qb.andWhere("medicationlogs.medicationLogsName ILIKE :searchTerm", { searchTerm })
          .orWhere("medicationlogs.medicationLogStatus ILIKE :searchTerm", { searchTerm })
          .orWhere("medicationlogs.uuid ILIKE :searchTerm", { searchTerm });
        }));
    } else {
      prnMedicationQueryBuilder
        .where('patient.uuid = :uuid', { uuid: patientUuid })
        .andWhere('medicationlogs.medicationType = :medicationType', { medicationType: 'PRN' });
    }
    const prnMedicationList = await prnMedicationQueryBuilder.getRawMany();
    const totalPatientPRNMedication = prnMedicationList.length; // Count the number of PRN medications returned
    const totalPages = Math.ceil(totalPatientPRNMedication / perPage);
    return {
      data: prnMedicationList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientPRNMedication,
    };
  }
  async getAllMedicationLogs(): Promise<MedicationLogs[]> {
    const medicationLogs = await this.medicationLogsRepository.find();
    return medicationLogs;
  }
  async updateMedicationLogs(
    id: string,
    updateMedicationLogsInput: UpdateMedicationLogsInput,
  ): Promise<MedicationLogs> {
    const { ...updateData } = updateMedicationLogsInput;
    const medicationLogs = await this.medicationLogsRepository.findOne({
      where: { uuid: id },
    });
    if (!medicationLogs) {
      throw new NotFoundException(`MedicationLogs ID-${id}  not found.`);
    }
    Object.assign(medicationLogs, updateData);
    return this.medicationLogsRepository.save(medicationLogs);
  }
  async softDeleteMedicationLogs(
    id: string,
  ): Promise<{ message: string; deletedMedicationLogs: MedicationLogs }> {
    // Find the patient record by ID
    const medicationLogs = await this.medicationLogsRepository.findOne({ where: { uuid: id } });

    if (!medicationLogs) {
      throw new NotFoundException(`MedicationLogs ID-${id} does not exist.`);
    }
    medicationLogs.deletedAt = new Date().toISOString();
    const deletedMedicationLogs = await this.medicationLogsRepository.save(medicationLogs);
    return { message: `MedicationLogs with ID ${id} has been soft-deleted.`, deletedMedicationLogs };

    return {
      message: `MedicationLogs with ID ${id} has been soft-deleted.`,
      deletedMedicationLogs,
    };
  }
}
