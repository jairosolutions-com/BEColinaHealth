import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmergencyContactsInput } from './dto/create-emergencyContacts.input';
import { UpdateEmergencyContactsInput } from './dto/update-emergencyContacts.input';
import { EmergencyContacts } from './entities/emergencyContacts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class EmergencyContactsService {
  constructor(
    @InjectRepository(EmergencyContacts)
    private emergencyContactsRepository: Repository<EmergencyContacts>,
    private idService: IdService, // Inject the IdService
  ) { }
  async createEmergencyContacts(input: CreateEmergencyContactsInput): Promise<EmergencyContacts> {
    const existingLowercaseboth = await this.emergencyContactsRepository.findOne({
      where: {
        firstName: ILike(`%${input.firstName}%`),
        lastName: ILike(`%${input.lastName}%`),
        phoneNumber: ILike(`%${input.phoneNumber}%`),
        patientId: (input.patientId)
      }
    });
    if (existingLowercaseboth) {
      throw new ConflictException(`Emergency Contact already exists for patientId ${input.patientId}`);
    }
    const newEmergencyContacts = new EmergencyContacts();
    const uuidPrefix = 'ECC-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newEmergencyContacts.uuid = uuid;

    Object.assign(newEmergencyContacts, input);
    return this.emergencyContactsRepository.save(newEmergencyContacts);
  }
  async getAllEmergencyContacts(): Promise<EmergencyContacts[]> {
    return this.emergencyContactsRepository.find();
  }
  async getAllEmergencyContactsByPatient(patientId: number, page: number = 1, sortBy: string = 'emergencyContactsDate', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: EmergencyContacts[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const totalPatientEmergencyContacts = await this.emergencyContactsRepository.count({
      where: { patientId },
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientEmergencyContacts / perPage);
    const emergencyContactsList = await this.emergencyContactsRepository.find({
      where: { patientId },
      skip: skip,
      take: perPage,
    });
    return {
      data: emergencyContactsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientEmergencyContacts
    };
  }

  async updateEmergencyContacts(id: number,
    updateLabResultsInput: UpdateEmergencyContactsInput,
  ): Promise<EmergencyContacts> {
    const { ...updateData } = updateLabResultsInput;
    const emergencyContacts = await this.emergencyContactsRepository.findOne({ where: { id } });
    if (!emergencyContacts) {
      throw new NotFoundException(`Lab Result ID-${id}  not found.`);
    }
    Object.assign(emergencyContacts, updateData);
    return this.emergencyContactsRepository.save(emergencyContacts);
  }
  async softDeleteEmergencyContacts(id: number): Promise<EmergencyContacts> {
    const emergencyContacts = await this.emergencyContactsRepository.findOne({ where: { id } });
    if (!emergencyContacts) {
      throw new NotFoundException(`Emergency Contacts ID-${id}  not found.`);
    }
    emergencyContacts.deletedAt = new Date().toISOString();
    return this.emergencyContactsRepository.save(emergencyContacts);
  }
}