import { Injectable } from '@nestjs/common';
import { CreatePatientInformationInput } from './dto/create-patient_information.input';
import { UpdatePatientInformationInput } from './dto/update-patient_information.input';

@Injectable()
export class PatientInformationService {
  create(createPatientInformationInput: CreatePatientInformationInput) {
    return 'This action adds a new patientInformation';
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
