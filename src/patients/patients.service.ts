import { Injectable } from '@nestjs/common';
import { CreatePatientsInput } from './dto/create-patients.input';
import { UpdatePatientsInput } from './dto/update-patients.input';
import { Patients } from './entities/patients.entity';
import { ILike, Like, Repository } from 'typeorm';
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
    private idService: IdService, // Inject the IdService
  ) { }

  //CREATE PATIENT INFO
  async createPatients(input: CreatePatientsInput): Promise<Patients> {
    // Check if a patient with similar information already exists
    const existingLowercaseboth = await this.patientsRepository.findOne({
      where: {
        firstName: Like(`%${input.firstName}%`),
        middleName: Like(`%${input.middleName}%`),
        lastName: Like(`%${input.lastName}%`),
        dateOfBirth: input.dateOfBirth, // Check for exact match
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
    return (result)

  }
  //GET FULL PATIENT INFORMATION
  async getAllPatientsFullInfo(): Promise<Patients[]> {
    return this.patientsRepository.find();
  }

  //GET ONE  PATIENT INFORMATION VIA ID
  async getPatientOverviewById(id: string): Promise<ProcessedPatient[]> {
    const patientList = await this.patientsRepository.find({
      select: ['uuid', 'firstName','middleName', 'lastName', 'age', 'gender', 'codeStatus'],
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
    console.log(processedPatientList, "pp")
    return processedPatientList;
  }

  //GET PAGED PATIENT LIST basic info for patient list with return to pages
  async getAllPatientsBasicInfo(
    term: string,
    page: number = 1,
    sortBy: string = 'lastName',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    perPage: number = 8,
  ): Promise<{
    data: Patients[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const skip = (page - 1) * perPage;
    //count the total rows searched
    const totalPatients = await this.patientsRepository.count({
      where: [
        { firstName: ILike(searchTerm) },
        { lastName: ILike(searchTerm) },
        { uuid: ILike(`${searchTerm}%`) },
      ],
    });
    //total number of pages
    const totalPages = Math.ceil(totalPatients / perPage);

    //find the data
    const patientList = await this.patientsRepository.find({
      select: ['uuid', 'firstName', 'lastName', 'age', 'gender', 'codeStatus'],
      where: [
        { firstName: ILike(searchTerm) },
        { lastName: ILike(searchTerm) },
        { uuid: ILike(`%${searchTerm}%`) },
        //ptn prefix
      ],
      skip: skip,
      take: perPage,
      order: { [sortBy]: sortOrder },
    });

    return {
      data: patientList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatients,
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
