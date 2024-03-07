import { Injectable } from '@nestjs/common';
import { CreateSurgeryDto } from './dto/create-surgery.dto';
import { UpdateSurgeryDto } from './dto/update-surgery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Surgery } from './entities/surgery.entity';
import { Repository } from 'typeorm';
import { PatientInformation } from 'src/patient_information/entities/patient_information.entity';
import { IdService } from 'services/uuid/id.service';

@Injectable()
export class SurgeryService {
  constructor(
    @InjectRepository(Surgery)
    private readonly surgeryRepository: Repository<Surgery>,
    @InjectRepository(PatientInformation)
    private readonly patientRepository: Repository<PatientInformation>,
    private idService: IdService,
  ) {}

  async createSurgery(createSurgeryDto: CreateSurgeryDto): Promise<Surgery> {
    const existingSurgery = await this.surgeryRepository.findOne({
      where: { typeOfSurgery: createSurgeryDto.typeOfSurgery },
    });

    const newSurgery = new Surgery();

    newSurgery.uuid = this.idService.generateRandomUUID('SGY-');

    // Fetch PatientInformation entity based on patientId
    const patient = await this.patientRepository.findOne({
      where: { id: createSurgeryDto.patientId },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    if (existingSurgery) {
      throw new Error('A Surgery with the same type of Surgery already exists');
    }

    // Assign patient to the allergy
    newSurgery.patient = patient;

    // Assign other properties
    Object.assign(newSurgery, createSurgeryDto);

    return this.surgeryRepository.save(newSurgery);
  }
}
