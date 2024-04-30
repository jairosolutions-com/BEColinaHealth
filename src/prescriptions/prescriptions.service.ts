import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePrescriptionsInput } from './dto/create-prescriptions.input';
import { UpdatePrescriptionsInput } from './dto/update-prescriptions.input';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import {
  Brackets,
  ILike,
  In,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Prescriptions } from './entities/prescriptions.entity';
import { IdService } from 'services/uuid/id.service'; //
import { Patients } from 'src/patients/entities/patients.entity';
import { PrescriptionFilesService } from 'src/prescriptionsFiles/prescriptionsFiles.service';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescriptions)
    private prescriptionsRepository: Repository<Prescriptions>,
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    @InjectRepository(MedicationLogs)
    private medicationLogsRepository: Repository<MedicationLogs>,
    private readonly prescriptionFilesService: PrescriptionFilesService,

    private idService: IdService, // Inject the IdService
  ) { }
  //CREATE Prescriptions INFO
  async createPrescriptions(
    patientUuid: string,
    prescriptionData: CreatePrescriptionsInput,
  ): Promise<Prescriptions> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ['id'],
      where: { uuid: patientUuid },
    });
    const existingPrescriptions = await this.prescriptionsRepository.findOne({
      where: {
        name: Like(`%${prescriptionData.name}%`),
        patientId: patientId,
      },
    });

    if (existingPrescriptions) {
      throw new ConflictException('Prescriptions already exists.');
    }

    const newPrescriptions = new Prescriptions();

    const uuidPrefix = 'PRC-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);

    newPrescriptions.uuid = uuid;
    newPrescriptions.patientId = patientId; // Assign patientId
    Object.assign(newPrescriptions, prescriptionData);
    const savedPrescription =
      await this.prescriptionsRepository.save(newPrescriptions);
    const result = { ...savedPrescription };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;

    await this.createTimeGraphPrescription(newPrescriptions.uuid);
    return result;
  }

  async createTimeGraphPrescription(prescriptionUuid: string) {
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);
    console.log(prescriptionUuid, 'prescriptionUUID');
    console.log('currentDate now', todayDate);

    const prescriptions = await this.prescriptionsRepository.find({
      select: ['patientId', 'id', 'frequency', 'name', 'interval'],
      where: {
        status: 'active',
        uuid: prescriptionUuid,
      },
    });

    console.log('prescriptions', prescriptions);

    if (prescriptions && prescriptions.length > 0) {
      for (const prescription of prescriptions) {
        const medlogs = await this.medicationLogsRepository.find({
          select: [
            'patientId',
            'uuid',
            'prescriptionId',
            'medicationLogStatus',
            'medicationLogsName',
          ],
          where: {
            createdAt: MoreThanOrEqual(todayDate.toISOString()),
            prescriptionId: prescription.id,
            patientId: prescription.patientId,
          },
        });

        console.log('prescription', prescription);
        console.log('medlogs', medlogs);

        // Determine the expected number of logs based on frequency
        let expectedLogs = 0;
        if (prescription.frequency === 'Once Daily') {
          expectedLogs = 1;
        } else if (prescription.frequency === 'Twice Daily') {
          expectedLogs = 2;
        } else if (prescription.frequency === 'Thrice Daily') {
          expectedLogs = 3;
        }

        // Check if the actual number of logs is less than the expected number
        if (medlogs.length < expectedLogs) {
          console.log(
            `Creating medication logs for ${prescription.frequency} prescription...`,
          );
          for (let i = medlogs.length; i < expectedLogs; i++) {
            const newMedicationLogs = new MedicationLogs();
            const uuidPrefix = 'MDL-'; // Customize prefix as needed
            const uuid = this.idService.generateRandomUUID(uuidPrefix);
            newMedicationLogs.uuid = uuid;
            newMedicationLogs.medicationLogsName = prescription.name;
            newMedicationLogs.medicationLogsDate = todayDate
              .toISOString()
              .split('T')[0];
            // Calculate medicationLogsTime based on interval
            newMedicationLogs.medicationLogsTime = this.calculateMedicationTime(
              prescription.frequency,
              i,
              prescription.interval,
            );
            newMedicationLogs.notes = 'Generated by system';
            newMedicationLogs.medicationType = 'ASCH';
            newMedicationLogs.patientId = prescription.patientId;
            newMedicationLogs.prescriptionId = prescription.id;
            newMedicationLogs.medicationLogStatus = 'pending';
            Object.assign(newMedicationLogs);
            const savedMedicationLogs =
              await this.medicationLogsRepository.save(newMedicationLogs);
            const result = { ...newMedicationLogs };
            delete result.patientId;
            delete result.deletedAt;
            delete result.updatedAt;
            delete result.id;
            console.log('Saved medication logs:', result);
          }
        } else if (medlogs.length > expectedLogs) {
          console.log(
            `Deleting medication logs for ${prescription.frequency} prescription...`,
          );
          for (let i = expectedLogs; i < medlogs.length; i++) {
            const medLog = medlogs[i];
            console.log(medlogs[i], 'medlogs[i]');
            await this.softDeletePrescriptionTimeChart(medLog.uuid);
          }
        }
      }
    }
  }

  async softDeletePrescriptionTimeChart(
    id: string,
  ): Promise<{ message: string; deletedMedicationLogs: MedicationLogs }> {
    // Find the patient record by ID
    console.log('soft delete', id);
    const medicationlogs = await this.medicationLogsRepository.findOne({
      where: { uuid: id },
    });

    if (!medicationlogs) {
      throw new NotFoundException(`MedicationLogs ID-${id} does not exist.`);
    }

    // Set the deletedAt property to mark as soft deleted
    medicationlogs.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedMedicationLogs =
      await this.medicationLogsRepository.save(medicationlogs);

    return {
      message: `MedicationLogs with ID ${id} has been soft-deleted.`,
      deletedMedicationLogs,
    };
  }

  // Function to calculate medicationLogsTime based on frequency and interval
  calculateMedicationTime(
    frequency: string,
    index: number,
    intervals: string,
  ): string {
    let hour = 8; // Default hour for medicationLogsTime
    const interval = parseInt(intervals); // Default interval in hours

    // Adjust hour based on index and frequency
    if (frequency === 'Twice Daily') {
      hour += index * interval;
    } else if (frequency === 'Thrice Daily') {
      hour += index * interval;
    }

    // Ensure hour is within 0-23 range
    hour = hour % 24;

    // Convert hour to string format with leading zeros if necessary
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;

    return `${hourStr}:00`;
  }

  //PAGED Prescriptions list PER PATIENT
  async getAllPrescriptionsByPatient(
    patientUuid: string,
    term: string,
    page: number = 1,
    sortBy: string = 'status',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5,
  ): Promise<{
    data: Prescriptions[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const skip = (page - 1) * perPage;
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const patientExists = await this.patientsRepository.findOne({
      where: { uuid: patientUuid },
    });

    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
    const prescriptionsQueryBuilder = this.prescriptionsRepository
      .createQueryBuilder('prescriptions')
      .leftJoinAndSelect('prescriptions.patient', 'patient')
      .select([
        'prescriptions.uuid',
        'prescriptions.name',
        'prescriptions.status',
        'prescriptions.dosage',
        'prescriptions.frequency',
        'prescriptions.interval',
        'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .orderBy(`${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (term !== '') {
      console.log('term', term);
      prescriptionsQueryBuilder
        .where(
          new Brackets((qb) => {
            qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid });
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            qb.andWhere('prescriptions.uuid ILIKE :searchTerm', {
              searchTerm,
            }).orWhere('prescriptions.name ILIKE :searchTerm', { searchTerm });
          }),
        );
    }
    // Get prescriptions
    const prescriptionResultList = await prescriptionsQueryBuilder.getRawMany();
    const totalPatientPrescriptions = await prescriptionsQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientPrescriptions / perPage);

    return {
      data: prescriptionResultList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientPrescriptions,
    };
  }
  //LIST Prescriptions NAMES Dropdown  PER PATIENT
  async getPrescriptionsDropDownByPatient(
    patientId: string,
  ): Promise<Prescriptions[]> {
    const prescriptionsNameList = await this.prescriptionsRepository.find({
      select: ['name'],
      where: { uuid: patientId },
    });
    return prescriptionsNameList;
  }
  async getAllPrescriptions(): Promise<Prescriptions[]> {
    const prescriptions = await this.prescriptionsRepository.find();
    return prescriptions;
  }

  async updatePrescriptions(
    id: string,
    updatePrescriptionsInput: UpdatePrescriptionsInput,
  ): Promise<Prescriptions> {
    const { ...updateData } = updatePrescriptionsInput;
    const prescriptions = await this.prescriptionsRepository.findOne({
      where: { uuid: id },
    });
    if (!prescriptions) {
      throw new NotFoundException(`Prescriptions ID-${id}  not found.`);
    }

    // Check if the frequency has been updated
    if (
      updateData.frequency &&
      updateData.frequency !== prescriptions.frequency
    ) {
      // Update the frequency and save the prescription
      prescriptions.frequency = updateData.frequency;
      await this.prescriptionsRepository.save(prescriptions);

      // Recreate medication logs based on the new frequency
      await this.createTimeGraphPrescription(id);
    } else {
      // If frequency is not updated, simply update the prescription data
      Object.assign(prescriptions, updateData);
      await this.prescriptionsRepository.save(prescriptions);
    }

    return prescriptions;
  }

  async softDeletePrescriptions(
    id: string,
  ): Promise<{ message: string; deletedPrescriptions: Prescriptions }> {
    // Find the patient record by ID
    const prescriptions = await this.prescriptionsRepository.findOne({
      where: { uuid: id },
    });

    if (!prescriptions) {
      throw new NotFoundException(`Prescriptions ID-${id} does not exist.`);
    }

    // Set the deletedAt property to mark as soft deleted
    prescriptions.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedPrescriptions =
      await this.prescriptionsRepository.save(prescriptions);

    return {
      message: `Prescriptions with ID ${id} has been soft-deleted.`,
      deletedPrescriptions,
    };
  }

  //for medical history logs scheduled

  async getAllPrescriptionsByPatientForSchedMed(
    patientUuid: string,
  ): Promise<{ data: Prescriptions[] }> {
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);
    const prescriptionsQueryBuilder = this.prescriptionsRepository
      .createQueryBuilder('prescriptions')
      .leftJoinAndSelect('prescriptions.patient', 'patient')
      .leftJoinAndSelect('prescriptions.medicationlogs', 'medicationlogs')
      .select([
        'prescriptions.uuid',
        'prescriptions.name',
        'medicationlogs.medicationLogsTime',
        'medicationlogs.uuid',
        'prescriptions.frequency',
        'prescriptions.interval',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .andWhere('prescriptions.status = :status', { status: 'active' })
      .andWhere('medicationlogs.createdAt >= :todayDate', {
        todayDate: todayDate.toISOString().split('T')[0],
      }) // Filter by today's date
      .andWhere('medicationlogs.medicationLogStatus = :medicationLogStatus', {
        medicationLogStatus: 'pending',
      })

      .orderBy('prescriptions.name', 'ASC');

    const prescriptionResultList = await prescriptionsQueryBuilder.getRawMany();

    return {
      data: prescriptionResultList,
    };
  }
  async searchPatients(term: string): Promise<Patients[]> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const patients = await this.patientsRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.medicationlogs', 'medicationlogs')
      .leftJoinAndSelect('patient.prescriptions', 'prescriptions')
      .leftJoinAndSelect('patient.allergies', 'allergies')
      .where('patient.firstName ILIKE :searchTerm', { searchTerm })
      .orWhere('patient.lastName ILIKE :searchTerm', { searchTerm })
      .orWhere('patient.email ILIKE :searchTerm', { searchTerm })
      .getMany();
    console.log('patients', patients);
    return patients;
  }

  async getPatientsWithMedicationLogsAndPrescriptions(
    term: string,
    page: number = 1,
    perPage: number = 3,
  ): Promise<{
    data: Patients[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }> {
    const skip = (page - 1) * perPage;
    const searchTerm = `%${term}%`;

    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);
    console.log(todayDate, 'todayDate');
    const [patientTimeGraph, totalPatientPrescriptions] = await Promise.all([
      this.patientsRepository
        .createQueryBuilder('patient')
        .leftJoinAndSelect('patient.medicationlogs', 'medicationlogs')
        .leftJoinAndSelect('patient.prescriptions', 'prescriptions')
        .leftJoinAndSelect('patient.allergies', 'allergies')
        .where('prescriptions.status = :status', { status: 'active' })
        .andWhere('medicationlogs.createdAt >= :todayDate', {
          todayDate: todayDate.toISOString().split('T')[0],
        }) // Filter by today's date
        .andWhere(
          'medicationlogs.prescriptionId IN (SELECT id FROM prescriptions WHERE status = :status)',
          { status: 'active' },
        )
        .orderBy('patient.firstName', 'ASC')
        .distinct(true)
        .skip(skip)
        .take(perPage),
      this.patientsRepository
        .createQueryBuilder('patient')
        .leftJoin('patient.medicationlogs', 'medicationlogs')
        .leftJoin('patient.prescriptions', 'prescriptions')
        .where('prescriptions.status = :status', { status: 'active' })
        .andWhere('medicationlogs.createdAt >= :todayDate', {
          todayDate: todayDate.toISOString().split('T')[0],
        }), // Filter by today's date
    ]);

    if (term !== '') {
      const patients = await this.searchPatients(searchTerm);
      patientTimeGraph.where(
        new Brackets((qb) => {
          qb.andWhere('patient.uuid ILIKE :searchTerm', {
            searchTerm,
          })
            .orWhere('patient.firstName ILIKE :searchTerm', { searchTerm })
            .andWhere('prescriptions.status = :status', { status: 'active' })
            .andWhere('medicationlogs.createdAt >= :todayDate', {
              todayDate: todayDate.toISOString().split('T')[0],
            }); // Filter by today's date;
        }),
      );
    }

    const totalPatientPrescription = await totalPatientPrescriptions.getCount();
    const patientPrescriptions = await patientTimeGraph.getMany();
    // Fetch all prescription UUIDs
    const medicationlogPrescriptionIds = patientPrescriptions.flatMap(
      (patient) =>
        patient.medicationlogs.map(
          (medicationlog) => medicationlog.prescriptionId,
        ),
    );
    const prescriptions = await this.prescriptionsRepository.find({
      select: ['id', 'uuid'],
      where: {
        id: In(medicationlogPrescriptionIds),
      },
    });
    const prescriptionMap = new Map(
      prescriptions.map((prescription) => [prescription.id, prescription.uuid]),
    );

    // Filter out medication logs that are before today's date
    patientPrescriptions.forEach((patient) => {
      patient.medicationlogs = patient.medicationlogs.filter(
        (medicationlog) => {
          // Convert createdAt to Date object
          const logDate = new Date(medicationlog.createdAt);
          // Extract date portion (year, month, day)
          const logDateOnly = new Date(
            logDate.getFullYear(),
            logDate.getMonth(),
            logDate.getDate(),
          );
          // Extract today's date
          const today = new Date();
          const todayOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
          );

          // Compare date portions
          if (logDateOnly.getTime() === todayOnly.getTime()) {
            // Add additional properties to medicationlog object
            const prescriptionUuid = prescriptionMap.get(
              medicationlog.prescriptionId,
            );
            if (prescriptionUuid) {
              (medicationlog as any).prescriptionUuid = prescriptionUuid;
            }
            return true;
          } else {
            return false;
          }
        },
      );

      // Remove unnecessary fields
      delete patient.id;
      patient.medicationlogs.forEach((medicationlog) => {
        delete medicationlog.id;
        delete medicationlog.patientId;
        delete medicationlog.prescriptionId;
      });
      patient.allergies.forEach((allergy) => {
        delete allergy.id;
        delete allergy.patientId;
      });
      patient.prescriptions.forEach((prescription) => {
        delete prescription.id;
        delete prescription.patientId;
      });

      // Calculate distinct allergy types for the current patient
    });

    const totalPages = Math.ceil(totalPatientPrescription / perPage);
    console.log(patientPrescriptions, 'patientPrescriptions');
    console.log(totalPages, 'totalPages');
    return {
      data: patientPrescriptions,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientPrescription,
    };
  }
  //Prescription Files
  //prescription FILES
  async addPrescriptionFile(prescriptionUuid: string, imageBuffer: Buffer, filename: string) {
    console.log(`Received prescriptionUuid: ${prescriptionUuid}`);

    if (!prescriptionUuid) {
      console.error('No prescriptionUuid provided.');
      throw new BadRequestException(`No prescription uuid provided`);
    }

    const { id: prescriptionId } = await this.prescriptionsRepository.findOne({
      select: ['id'],
      where: { uuid: prescriptionUuid },
    });

    console.log(`Found prescription ID: ${prescriptionId}`);

    if (!prescriptionId) {
      throw new BadRequestException(
        `Prescription with UUID ${prescriptionUuid} not found`,
      );
    }

    const prescriptionFile =
      await this.prescriptionFilesService.uploadPrescriptionFile(
        imageBuffer,
        filename,
        prescriptionId,
      );

    if (!prescriptionFile) {
      throw new BadRequestException(
        `Failed to upload prescription file for prescription UUID ${prescriptionUuid}`,
      );
    }

    console.log(`Prescription file uploaded successfully: ${prescriptionFile}`);

    return prescriptionFile;
  }

  async getPrescriptionFilesByUuid(prescriptionUuid: string) {
    const prescription = await this.prescriptionsRepository.findOne({
      select: ['id'],
      where: { uuid: prescriptionUuid },
    });

    // Check if a prescription was found
    if (!prescription) {
      // If no prescription is found, throw a NotFoundException
      throw new NotFoundException(
        `Prescription with UUID ${prescriptionUuid} not found`,
      );
    }

    // If a prescription was found, destructure the 'id' property
    const { id: prescriptionId } = prescription;

    const prescriptionFiles =
      await this.prescriptionFilesService.getPrescriptionFilesByPrescriptionId(
        prescriptionId,
      );
    if (!prescriptionFiles) {
      throw new NotFoundException();
    }
    return prescriptionFiles;
  }

  async updatePrescriptionFile(prescriptionUuid: string, imageBuffer: Buffer, filename: string): Promise<any> {
    console.log(`Received prescriptionUuid: ${prescriptionUuid}`);

    // Validate the provided prescription UUID
    if (!prescriptionUuid) {
      console.error('No prescriptionUuid provided.');
      throw new BadRequestException(`No prescription UUID provided`);
    }

    // Find the prescription ID using the provided UUID
    const { id: prescriptionId } = await this.prescriptionsRepository.findOne({
      select: ['id'],
      where: { uuid: prescriptionUuid },
    });

    console.log(`Found prescription ID: ${prescriptionId}`);

    // Handle the case where the prescription ID is not found
    if (!prescriptionId) {
      throw new BadRequestException(
        `Prescription with UUID ${prescriptionUuid} not found`,
      );
    }

    // Update the prescription file using the prescription ID
    return this.prescriptionFilesService.updatePrescriptionFile(prescriptionId, imageBuffer, filename);
  }
  async getCurrentFileCountFromDatabase(prescriptionsUuid: string): Promise<number> {
    const { id: prescriptionId } = await this.prescriptionsRepository.findOne({
      select: ["id"],
      where: { uuid: prescriptionsUuid }
    });
    try {
      const files = await this.prescriptionFilesService.getPrescriptionFilesByPrescriptionId(prescriptionId);
      return files.length; // Return the number of files
    } catch (error) {
      throw new NotFoundException('Lab result files not found');
    }
  }

}
