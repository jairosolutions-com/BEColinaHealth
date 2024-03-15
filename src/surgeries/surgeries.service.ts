import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSurgeriesDto } from './dto/create-surgeries.dto';
import { UpdateSurgeriesDto } from './dto/update-surgeries.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Surgeries } from './entities/surgeries.entity';
import { ILike, Repository } from 'typeorm';
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
  ) {}

  async createAllergies(input: CreateSurgeriesDto): Promise<Surgeries> {
    const existingLowercaseboth = await this.surgeriesRepository.findOne({
      where: {
        typeOfSurgeries: ILike(`%${input.typeOfSurgeries}%`),
        uuid: input.uuid,
      },
    });
    if (existingLowercaseboth) {
      throw new ConflictException(
        'A Surgeries with the same type of Surgeries already exists',
      );
    }
    const newAllergies = new Surgeries();
    const uuidPrefix = 'SGY-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newAllergies.uuid = uuid;

    Object.assign(newAllergies, input);
    return this.surgeriesRepository.save(newAllergies);
  }
}
