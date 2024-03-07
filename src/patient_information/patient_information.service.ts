import { Injectable } from '@nestjs/common';
import { CreatePatientInformationInput } from './dto/create-patient_information.input';
import { UpdatePatientInformationInput } from './dto/update-patient_information.input';
import { PatientInformation } from './entities/patient_information.entity';
import { ILike, Repository } from 'typeorm';
import { IdService } from 'services/uuid/id.service'; // 
import { HttpException, HttpStatus, NotFoundException, ConflictException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class PatientInformationService {
  constructor(
    @InjectRepository(PatientInformation)
    private patientInformationRepository: Repository<PatientInformation>,
    private idService: IdService, // Inject the IdService
  ) { }
  //CREATE PATIENT INFO
  async createPatientInformation(input: CreatePatientInformationInput): Promise<PatientInformation> {
    // Check if a patient with similar information already exists
    const existingLowercaseboth = await this.patientInformationRepository.findOne({
      where: {
        firstName: ILike(`%${input.firstName}%`),
        lastName: ILike(`%${input.lastName}%`),
        dateOfBirth: input.dateOfBirth // Check for exact match
      },

    });
    // If a patient with similar information exists, throw an error
    if (existingLowercaseboth) {
      throw new ConflictException('Patient already exists.');
    }

    // Create a new instance of the PatientInformation entity
    const newPatientInformation = new PatientInformation();

    // Generate a UUID for the patient information
    const uuidPrefix = 'PTN-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    // Assign the generated UUID and creation date to the new patient information
    newPatientInformation.uuid = uuid;

    // Copy the properties from the input object to the new patient information
    Object.assign(newPatientInformation, input);

    // Save the new patient information to the database
    return this.patientInformationRepository.save(newPatientInformation);
  }

  //GET FULL PATIENT INFORMATION
  async getAllPatientsFullInfo(): Promise<PatientInformation[]> {
    return this.patientInformationRepository.find();
  }

  //GET ONE  PATIENT INFORMATION VIA ID
  async getPatientOverviewById(id: number): Promise<PatientInformation[]> {
    const patientList = await this.patientInformationRepository.find({
      where: { id }

    });
    return patientList;
  }
  // async getPatientMedicalHistoryById(id: number): Promise<PatientInformation[]> {
  //   const patientList = await this.patientInformationRepository.find({
  //     where: { id },
  //     relations: [
  //       'medical_history',
  //     ],

  //   });
  //   return patientList;
  // }



  //GET PAGED PATIENT LIST basic info for patient list with return to pages

  async getAllPatientsBasicInfo(page: number = 1, sortBy: string = 'lastName', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5):
    //what is the expected data
    Promise<{ data: PatientInformation[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    //count the total rows searched
    const totalPatients = await this.patientInformationRepository.count({
      select: ["id", "uuid", "firstName", "lastName", "age", "gender" ],
      skip: skip,
      take: perPage,
    });
    //total number of pages
    const totalPages = Math.ceil(totalPatients / perPage);

    //find the data
    const patientList = await this.patientInformationRepository.find({
      select: ["id", "uuid", "firstName", "lastName", "age", "gender" , "codeStatus", ""],
      skip: skip,
      take: perPage,
      order: { [sortBy]: sortOrder } // Apply sorting based on sortBy and sortOrder

    });
    return {
      data: patientList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatients
    };
  }


  async searchAllPatientInfoByTerm(term: string, page: number = 1, perPage: number = 5):
    //what is the expected data
    Promise<{ data: PatientInformation[], totalPages: number, currentPage: number, totalCount }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const skip = (page - 1) * perPage;
    //count the total rows searched
    const totalPatients = await this.patientInformationRepository.count({
      where: [
        { firstName: ILike(searchTerm) },
        { lastName: ILike(searchTerm) },
        { uuid: ILike(`%ptn-${searchTerm}%`) },
      ],
    });
    //total number of pages
    const totalPages = Math.ceil(totalPatients / perPage);

    //find the data
    const patientList = await this.patientInformationRepository.find({
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
      totalCount: totalPatients
    };
  }



  async getAllPatientsWithDetails(): Promise<PatientInformation[]> {
    return this.patientInformationRepository.find({
      relations: [
        'medications',
        'vital_signs',
        'medical_history',
        'lab_results',
        'notes',
        'appointment',
        'emergency_contact',
        'prescription',

      ],
    });
  }
  async updatePatientInformation(id: number,
    updatePatientInformationInput: UpdatePatientInformationInput,
  ): Promise<PatientInformation> {
    const { ...updateData } = updatePatientInformationInput;

    // Find the patient record by ID
    const patient = await this.patientInformationRepository.findOne({ where: { id } });

    if (!patient) {
      throw new NotFoundException(`Patient ID-${id} not found.`);
    }


    // Update the patient record with the new data
    Object.assign(patient, updateData);

    // Save the updated patient record
    return this.patientInformationRepository.save(patient);
  }

  async softDeletePatient(id: number): Promise<{ message: string, deletedPatient: PatientInformation }> {
    // Find the patient record by ID
    const patient = await this.patientInformationRepository.findOne({ where: { id } });

    if (!patient) {
      throw new NotFoundException(`Patient ID-${id} does not exist.`);
    }

    // Set the deleted_at property to mark as soft deleted
    patient.deleted_at = new Date().toISOString();

    // Save and return the updated patient record
    const deletedPatient = await this.patientInformationRepository.save(patient);

    return { message: `Patient with ID ${id} has been soft-deleted.`, deletedPatient };

  }

  // async restore(id: number): Promise<void> {
  //   await this.prescriptionRepository.restore(id);
  // }

}
