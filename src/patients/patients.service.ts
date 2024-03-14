import { Injectable } from '@nestjs/common';
import { CreatePatientsInput } from './dto/create-patients.input';
import { UpdatePatientsInput } from './dto/update-patients.input';
import { Patients } from './entities/patients.entity';
import { ILike, Repository } from 'typeorm';
import { IdService } from 'services/uuid/id.service'; //
import {
  HttpException,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { ProcessedPatient, fullPatientInfo } from './entities/processedPatientInterface';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    private idService: IdService, // Inject the IdService
  ) { }
  //CREATE PATIENT INFO
  async createPatients(
    input: CreatePatientsInput,
  ): Promise<Patients> {
    // Check if a patient with similar information already exists
    const existingLowercaseboth =
      await this.patientsRepository.findOne({
        where: {
          firstName: ILike(`%${input.firstName}%`),
          lastName: ILike(`%${input.lastName}%`),
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

    // Save the new patient information to the database
    return this.patientsRepository.save(newPatients);
  }

  //GET FULL PATIENT INFORMATION
  async getAllPatientsFullInfo(): Promise<Patients[]> {
    return this.patientsRepository.find();
  }

  //GET ONE  PATIENT INFORMATION VIA ID
  async getPatientOverviewById(id: string): Promise<ProcessedPatient[]> {
    const patientList = await this.patientsRepository.find({
      select: ["uuid", "firstName", "lastName", "age", "gender", "codeStatus", "medicalCondition"],
      where: { uuid: id, },
      relations: ["allergies"]
    });

    const processedPatientList = patientList.map(patient => {
      const allergies = patient.allergies.map(allergies => allergies.type).join(', ');
      return { ...patient, allergies };
    });
    return processedPatientList;
  }
  async getPatientFullInfoById(id: string): Promise<fullPatientInfo[]> {

    
    const patientList = await this.patientsRepository.find({

      where: { uuid: id },
      relations: ["allergies"]
    });

    const processedPatientList = patientList.map(patient => {
      const allergies = patient.allergies.map(allergies => allergies.type).join(', ');
      return { ...patient, allergies };
    });
    return processedPatientList;
  }


  //GET PAGED PATIENT LIST basic info for patient list with return to pages

  async getAllPatientsBasicInfo(
    page: number = 1,
    sortBy: string = 'lastName',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5,
  ): //what is the expected data
    Promise<{
      data: Patients[];
      totalPages: number;
      currentPage: number;
      totalCount;
    }> {
    const skip = (page - 1) * perPage;
    //count the total rows searched
    const totalPatients = await this.patientsRepository.count({
      skip: skip,
      take: perPage,
    });
    //total number of pages
    const totalPages = Math.ceil(totalPatients / perPage);

    //find the data
    const patientList = await this.patientsRepository.find({
      select: [
        'uuid',
        'firstName',
        'lastName',
        'age',
        'gender',
        'codeStatus',
      ],
      skip: skip,
      take: perPage,
      order: { [sortBy]: sortOrder }, // Apply sorting based on sortBy and sortOrder

    });
    return {
      data: patientList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatients,
    };
  }

  async searchAllPatientInfoByTerm(
    term: string,
    page: number = 1,
    perPage: number = 5,
  ): //what is the expected data
    Promise<{
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
        { uuid: ILike(`%ptn-${searchTerm}%`) },
      ],
    });
    //total number of pages
    const totalPages = Math.ceil(totalPatients / perPage);

    //find the data
    const patientList = await this.patientsRepository.find({
      where: [
        { firstName: ILike(searchTerm) },
        { lastName: ILike(searchTerm) },
        { uuid: ILike(`%ptn-${searchTerm}%`) },
        //ptn prefix
      ],
      skip: skip,
      take: perPage,
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
      where: {uuid: id},
    });

    if (!patient) {
      throw new NotFoundException(`Patient ID-${id} does not exist.`);
    }

    // Set the deletedAt property to mark as soft deleted
    patient.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedPatient =
      await this.patientsRepository.save(patient);

    return {
      message: `Patient with ID ${id} has been soft-deleted.`,
      deletedPatient
    };
  }

  // async restore(id: number): Promise<void> {
  //   await this.prescriptionsRepository.restore(id);
  // }
}
