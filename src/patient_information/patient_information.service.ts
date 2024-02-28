import { Injectable } from '@nestjs/common';
import { CreatePatientInformationInput } from './dto/create-patient_information.input';
import { UpdatePatientInformationInput } from './dto/update-patient_information.input';
import { PatientInformation } from './entities/patient_information.entity';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PatientInformationService {
  constructor(
    @InjectRepository(PatientInformation)
    private patientInformationRepository: Repository<PatientInformation>,
  ) { }

  async createPatientInformation(
    createPatientInformationInput: CreatePatientInformationInput,
  ): Promise<PatientInformation> {
    const newPatientInformation = this.patientInformationRepository.create(
      createPatientInformationInput,
    );

    return this.patientInformationRepository.save(newPatientInformation);
  }
  async getAllPatients(): Promise<PatientInformation[]> {
    return this.patientInformationRepository.find();
  }

  async getPatientInformationById(
    id: number,
  ): Promise<PatientInformation> {
    return this.patientInformationRepository.findOneOrFail({
      where: { id },
    });
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

      ],
    });
  }
  async updatePatientInformation(
    updatePatientInformationInput: UpdatePatientInformationInput,
  ): Promise<PatientInformation> {
    const { id, ...updateData } = updatePatientInformationInput;

    // Find the patient record by ID
    const patient = await this.patientInformationRepository.findOneOrFail({
      where: { id },
    });

    // Update the patient record with the new data
    Object.assign(patient, updateData);

    // Save the updated patient record
    return this.patientInformationRepository.save(patient);
  }


  removePatientInformation(id: number) {
    return this.patientInformationRepository.delete(id);
  }
}
