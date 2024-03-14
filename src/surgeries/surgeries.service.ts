import { Injectable } from '@nestjs/common';
import { CreateSurgeriesDto } from './dto/create-surgeries.dto';
import { UpdateSurgeriesDto } from './dto/update-surgeries.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Surgeries } from './entities/surgeries.entity';
import { Repository } from 'typeorm';
import { Patients } from 'src/patients/entities/patients.entity';
import { IdService } from 'services/uuid/id.service';

@Injectable()
export class SurgeriesService {
  constructor(
    @InjectRepository(Surgeries)
    private readonly surgeriesRepository: Repository<Surgeries>,
    @InjectRepository(Patients)
    private readonly patientRepository: Repository<Patients>,
    private idService: IdService,
  ) { }

  async createSurgeries(createSurgeriesDto: CreateSurgeriesDto): Promise<Surgeries> {
    const existingSurgeries = await this.surgeriesRepository.findOne({
      where: { typeOfSurgeries: createSurgeriesDto.typeOfSurgeries },
    });

    const newSurgeries = new Surgeries();

    newSurgeries.uuid = this.idService.generateRandomUUID('SGY-');

    // Fetch Patients entity based on patientId
    const patient = await this.patientRepository.findOne({
      where: { id: createSurgeriesDto.patientId },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    if (existingSurgeries) {
      throw new Error('A Surgeries with the same type of Surgeries already exists');
    }

    // Assign patient to the allergies
    newSurgeries.patient = patient;

    // Assign other properties
    Object.assign(newSurgeries, createSurgeriesDto);

    return this.surgeriesRepository.save(newSurgeries);
  }
}
