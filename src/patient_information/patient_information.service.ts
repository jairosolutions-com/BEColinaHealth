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
  findAll() {
    return `This action returns all patientInformation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patientInformation`;
  }

  update(id: number, updatePatientInformationInput: UpdatePatientInformationInput) {
    return `This action updates a #${id} patientInformation`;
  }

  remove(id: number) {
    return `This action removes a #${id} patientInformation`;
  }
}
