import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmergencyContactsInput } from './dto/create-emergencyContacts.input';
import { UpdateEmergencyContactsInput } from './dto/update-emergencyContacts.input';
import { EmergencyContacts } from './entities/emergencyContacts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Brackets, ILike, Repository } from 'typeorm';
import { Patients } from 'src/patients/entities/patients.entity';

@Injectable()
export class EmergencyContactsService {
  constructor(
    @InjectRepository(EmergencyContacts)
    private emergencyContactsRepository: Repository<EmergencyContacts>,
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    private idService: IdService, // Inject the IdService
  ) { }
  async createEmergencyContacts(patientUuid: string,
    emergencyContactData: CreateEmergencyContactsInput,
  ): Promise<EmergencyContacts> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ["id"],
      where: { uuid: patientUuid }
    });
    const existingEmergencyContact =
      await this.emergencyContactsRepository.findOne({
        where: {
          firstName: ILike(`%${emergencyContactData.firstName}%`),
          lastName: ILike(`%${emergencyContactData.lastName}%`),
          phoneNumber: ILike(`%${emergencyContactData.phoneNumber}%`),
          patientId: emergencyContactData.patientId,
        },
      });
    if (existingEmergencyContact) {
      throw new ConflictException(
        `Emergency Contact already exists for patientId ${emergencyContactData.patientId}`,
      );
    }
    const newEmergencyContacts = new EmergencyContacts();
    const uuidPrefix = 'ECC-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newEmergencyContacts.uuid = uuid;

    newEmergencyContacts.uuid = uuid;
    newEmergencyContacts.patientId = patientId;
    Object.assign(newEmergencyContacts, emergencyContactData);
    const savedAllergies = await this.emergencyContactsRepository.save(newEmergencyContacts);
    const result = { ...savedAllergies };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;
    return (result)
  }
  async getAllEmergencyContacts(): Promise<EmergencyContacts[]> {
    return this.emergencyContactsRepository.find();
  }
  async getAllEmergencyContactsByPatient(patientUuid: string, term: string, page: number = 1, sortBy: string = 'lastName', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: EmergencyContacts[], totalPages: number, currentPage: number, totalCount: number }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term

    const skip = (page - 1) * perPage;

    const emergencyContactsQueryBuilder = this.emergencyContactsRepository
      .createQueryBuilder('contact')
      .innerJoinAndSelect('contact.patient', 'patient')
      .select([
        'contact.uuid',
        'contact.firstName',
        'contact.lastName',
        'contact.phoneNumber',
        'contact.patientRelationship',
        'contact.city',
        'contact.zip',
        'contact.country',
        'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .orderBy(`contact.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (term !== "") {
      console.log("term", term);
      emergencyContactsQueryBuilder
        .where(new Brackets((qb) => {
          qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid })
        }))
        .andWhere(new Brackets((qb) => {
          qb.andWhere("contact.firstName ILIKE :searchTerm", { searchTerm })
            .orWhere("contact.lastName ILIKE :searchTerm", { searchTerm })
            .orWhere("contact.patientRelationship ILIKE :searchTerm", { searchTerm });
        }));
    }
    const emergencyContactsList = await emergencyContactsQueryBuilder.getRawMany();
    const totalPatientEmergencyContacts = await emergencyContactsQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientEmergencyContacts / perPage);

    return {
      data: emergencyContactsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientEmergencyContacts,
    };
  }


  async updateEmergencyContacts(
    id: string,
    updateLabResultsInput: UpdateEmergencyContactsInput,
  ): Promise<EmergencyContacts> {
    const { ...updateData } = updateLabResultsInput;
    const emergencyContacts = await this.emergencyContactsRepository.findOne({
      where: { uuid: id },
    });
    if (!emergencyContacts) {
      throw new NotFoundException(`Lab Result ID-${id}  not found.`);
    }
    Object.assign(emergencyContacts, updateData);
    return this.emergencyContactsRepository.save(emergencyContacts);
  }
  async softDeleteEmergencyContacts(id: string): Promise<EmergencyContacts> {
    const emergencyContacts = await this.emergencyContactsRepository.findOne({ where: { uuid: id } });

    if (!emergencyContacts) {
      throw new NotFoundException(`Emergency Contacts ID-${id}  not found.`);
    }
    emergencyContacts.deletedAt = new Date().toISOString();
    return this.emergencyContactsRepository.save(emergencyContacts);
  }
}
