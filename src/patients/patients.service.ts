import { Injectable } from '@nestjs/common';
import { CreatePatientsInput } from './dto/create-patients.input';
import { UpdatePatientsInput } from './dto/update-patients.input';
import { Patients } from './entities/patients.entity';
import { Brackets, ILike, In, Like, Repository } from 'typeorm';
import { IdService } from 'services/uuid/id.service'; //
import {
  HttpException,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {
  ProcessedPatient,
  fullPatientInfo,
} from './entities/processedPatientInterface';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    // @InjectRepository(Prescriptions)
    // private prescriptionRepository: Repository<Prescriptions>,

    private idService: IdService, // Inject the IdService
  ) {}

  //CREATE PATIENT INFO
  async createPatients(input: CreatePatientsInput): Promise<Patients> {
    // Check if a patient with similar information already exists
    const existingLowercaseboth = await this.patientsRepository.findOne({
      where: {
        firstName: Like(`%${input.firstName}%`),
        middleName: Like(`%${input.middleName}%`),
        lastName: Like(`%${input.lastName}%`),
      },
    });
    // If a patient with similar information exists, throw an error
    if (existingLowercaseboth) {
      throw new ConflictException('Patient already exists.');
    }

    // Create a new instance of the Patients entity
    const newPatients = new Patients();

    // Generate a UUID for the patient information
    const uuidPrefix = 'PTN-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    // Assign the generated UUID and creation date to the new patient information
    newPatients.uuid = uuid;

    // Copy the properties from the input object to the new patient information
    Object.assign(newPatients, input);
    const savedPatient = await this.patientsRepository.save(newPatients);
    const result = { ...savedPatient };
    delete result.id;
    delete result.deletedAt;
    delete result.updatedAt;
    return result;
  }
  //GET FULL PATIENT INFORMATION
  async getAllPatientsFullInfo(): Promise<Patients[]> {
    return this.patientsRepository.find();
  }

  //GET ONE  PATIENT INFORMATION VIA ID
  async getPatientOverviewById(id: string): Promise<ProcessedPatient[]> {
    const patientList = await this.patientsRepository.find({
      select: [
        'uuid',
        'firstName',
        'middleName',
        'lastName',
        'age',
        'gender',
        'codeStatus',
      ],
      where: { uuid: id },
      relations: ['allergies'],
    });

    const processedPatientList = patientList.map((patient) => {
      // const allergies = patient.allergies
      //   .map((allergies) => allergies.type)
      //   .join(', ');
      // return { ...patient, allergies };
      const uniqueAllergyTypes = [
        ...new Set(patient.allergies.map((allergy) => allergy.type)),
      ];

      return {
        ...patient,
        allergies: uniqueAllergyTypes.join(', '), // Join unique allergy types into a single string
      };
    });
    return processedPatientList;
  }

  async getPatientFullInfoById(id: string): Promise<fullPatientInfo[]> {
    const patientList = await this.patientsRepository.find({
      where: { uuid: id },
      relations: ['allergies'],
    });

    const processedPatientList = patientList.map((patient) => {
      const uniqueAllergyTypes = [
        ...new Set(patient.allergies.map((allergy) => allergy.type)),
      ];

      // Creating a copy of patient object to avoid mutating original data
      const processedPatient = { ...patient };

      // Deleting the uuid property from the copied object
      delete processedPatient.id;
      return {
        ...processedPatient,
        allergies: uniqueAllergyTypes.join(', '), // Join unique allergy types into a single string
      };
    });
    console.log(processedPatientList, 'pp');
    return processedPatientList;
  }

  //GET PAGED PATIENT LIST basic info for patient list with return to pages
  async getAllPatientsBasicInfo(
    term: string,
    page: number = 1,
    sortBy: string = 'lastName',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    perPage: number = 5,
  ): Promise<{
    data: Patients[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const skip = (page - 1) * perPage;

    // Count the total rows searched
    const totalPatients = await this.patientsRepository.count({
      where: [
        { firstName: ILike(searchTerm) },
        { lastName: ILike(searchTerm) },
        { uuid: ILike(`${searchTerm}%`) },
      ],
    });

    // Total number of pages
    const totalPages = Math.ceil(totalPatients / perPage);

    const searchWords = term.split(' ').map((word) => `%${word}%`);

    // Find the data
    const patientList = await this.patientsRepository
      .createQueryBuilder('patient')
      .select([
        'patient.uuid',
        'patient.firstName',
        'patient.lastName',
        'patient.age',
        'patient.gender',
        'patient.codeStatus',
      ])
      .where(
        new Brackets((qb) => {
          qb.where('patient.firstName ILIKE :searchTerm', { searchTerm })
            .orWhere('patient.lastName ILIKE :searchTerm', { searchTerm })
            .orWhere('patient.uuid ILIKE :searchTerm', {
              searchTerm: `${searchTerm}%`,
            });
        }),
      )
      .orWhere(
        new Brackets((qb) => {
          for (const word of searchWords) {
            qb.andWhere(
              new Brackets((subQb) => {
                subQb
                  .where('patient.firstName ILIKE :word', { word })
                  .orWhere('patient.lastName ILIKE :word', { word });
              }),
            );
          }
        }),
      )
      .skip(skip)
      .take(perPage)
      .orderBy(`patient.${sortBy}`, sortOrder)
      .getMany();

    return {
      data: patientList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatients,
    };
  }

  async getAllPatientsFullName(): Promise<{
    data: Patients[];
  }> {
    const patientList = await this.patientsRepository.find({
      select: ['uuid', 'firstName', 'lastName'],
      order: { lastName: 'ASC' },
    });
    return {
      data: patientList,
    };
  }
  async getAllPatientsWithDetails(): Promise<Patients[]> {
    return this.patientsRepository.find({
      relations: [
        'medicationLogs',
        'vitalSigns',
        'medical_history',
        'lab_results',
        'notes',
        'appointments',
        'emergencyContacts',
        'prescriptions',
      ],
    });
  }
  
  async getPatientRecentInfo(id: string): Promise<{
    data: Patients[];
    totalMedicationDue: number
    totalMedicationDone: number
  }> {
    const patientExists = await this.patientsRepository.findOne({
      where: { uuid: id },
      select: ['id']
    });
    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
  
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  
    const medicationCountSubQuery = this.patientsRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.medicationlogs', 'medicationlogs')
      .select('COUNT(medicationlogs.id)', 'medicationCount')
      .where('medicationlogs.patientId = :id',{id:patientExists.id})
      .andWhere('medicationlogs.medicationType = :medicationType', {
        medicationType: 'ASCH',
      })
      .andWhere(
        'medicationlogs.medicationLogStatus = :medicationLogStatus',
        {
          medicationLogStatus: 'pending',
        },
      )
      .andWhere('medicationlogs.medicationLogsDate = :today', { today: formattedToday });
  
      const medicationDoneCount = this.patientsRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.medicationlogs', 'medicationlogs')
      .select('COUNT(medicationlogs.id)', 'medicationCount')
      .where('medicationlogs.patientId = :id',{id:patientExists.id})
      .andWhere('medicationlogs.medicationType = :medicationType', {
        medicationType: 'ASCH',
      })
      .andWhere(
        'medicationlogs.medicationLogStatus != :medicationLogStatus',
        {
          medicationLogStatus: 'pending',
        },
      )
      .andWhere('medicationlogs.medicationLogsDate = :today', { today: formattedToday });
  
      const patientRecentInfo = this.patientsRepository
      .createQueryBuilder('patient')
      .leftJoin('patient.vitalsign', 'vitalsign')
      .leftJoin('patient.medicationlogs', 'medicationlogs')
      .leftJoin('patient.allergies', 'allergies')
      .select(['patient.firstName', 'patient.lastName', 'patient.middleName','patient.age', 'patient.admissionDate' , 'patient.gender' , 'patient.age' ,'patient.dateOfBirth','patient.address1','patient.phoneNo'])
      .addSelect('COALESCE(medicationlogs.medicationLogsName, \'No Medication Taken\')', 'medicationLogsName')
      .addSelect('COALESCE(medicationlogs.medicationLogsTime, \'No Time\')', 'medicationLogsTime')
      .addSelect('COALESCE(medicationlogs.medicationLogsDate, \'No Date\')', 'medicationLogsDate')
      .addSelect('COALESCE(vitalsign.bloodPressure, \'No Blood Pressure\')', 'bloodPressure')
      .addSelect('COALESCE(vitalsign.heartRate, \'No Heart Rate\')', 'heartRate')
      .addSelect('COALESCE(vitalsign.temperature, \'No Temperature\')', 'temperature')
      .addSelect('COALESCE(vitalsign.respiratoryRate, \'No Respiratory Rate\')', 'respiratoryRate')
      .addSelect('COALESCE(allergies.allergen, \'No Allergen\')', 'allergen')
      .where('patient.uuid = :uuid', { uuid: id })
      .orderBy('medicationlogs.createdAt', 'DESC')
      .addOrderBy('vitalsign.createdAt', 'DESC')
      .limit(1);
    
  
    const patientRecentInfoList = await patientRecentInfo.getRawMany();
      const totalMedicationCount = await medicationCountSubQuery.getRawOne();
      const totalMedicationDoneCount = await medicationDoneCount.getRawOne();
    return {
      data: patientRecentInfoList,
      totalMedicationDue: totalMedicationCount,
      totalMedicationDone: totalMedicationDoneCount
    };
  }

  async updatePatients(
    id: string,
    updatePatientsInput: UpdatePatientsInput,
  ): Promise<Patients> {
    const { ...updateData } = updatePatientsInput;

    // Find the patient record by ID
    const patient = await this.patientsRepository.findOne({
      where: { uuid: id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient ID-${id} not found.`);
    }

    // Update the patient record with the new data
    Object.assign(patient, updateData);

    // Save the updated patient record
    return this.patientsRepository.save(patient);
  }

  async softDeletePatient(
    id: string,
  ): Promise<{ message: string; deletedPatient: Patients }> {
    // Find the patient record by ID
    const patient = await this.patientsRepository.findOne({
      where: { uuid: id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient ID-${id} does not exist.`);
    }

    // Set the deletedAt property to mark as soft deleted
    patient.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedPatient = await this.patientsRepository.save(patient);

    return {
      message: `Patient with ID ${id} has been soft-deleted.`,
      deletedPatient,
    };
  }
}
