import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrescriptionsInput } from './dto/create-prescriptions.input';
import { UpdatePrescriptionsInput } from './dto/update-prescriptions.input';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { ILike, Repository } from 'typeorm';
import { Prescriptions } from './entities/prescriptions.entity';
import { IdService } from 'services/uuid/id.service'; // 

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescriptions)
    private prescriptionsRepository: Repository<Prescriptions>,
    private idService: IdService, // Inject the IdService
  ) { }
  //CREATE Prescriptions INFO
  async createPrescriptions(input: CreatePrescriptionsInput): Promise<Prescriptions> {
    const existingLowercaseboth = await this.prescriptionsRepository.findOne({
      where: {
        name: ILike(`%${input.name}%`),
        dosage: ILike(`%${input.dosage}%`),
        interval: ILike(`%${input.interval}%`),
        status: ILike(`%${input.status}%`),
        patientId: (input.patientId)
      },

    });

    if (existingLowercaseboth) {
      throw new ConflictException('Prescriptions already exists.');
    }

    const newPrescriptions = new Prescriptions();

    const uuidPrefix = 'PRC-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);

    newPrescriptions.uuid = uuid;

    // Copy the properties from the input object to the new patient information
    Object.assign(newPrescriptions, input);

    return this.prescriptionsRepository.save(newPrescriptions);
  }

  //PAGED Prescriptions list PER PATIENT
  async getAllPrescriptionsByPatient(patientId: string, page: number = 1, sortBy: string = 'lastName', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: Prescriptions[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const totalPatientPrescriptions = await this.prescriptionsRepository.count({
      where: { uuid: patientId },
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientPrescriptions / perPage);
    const prescriptionsList = await this.prescriptionsRepository.find({
      where: { uuid: patientId },
      skip: skip,
      take: perPage,
    });
    return {
      data: prescriptionsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientPrescriptions
    };
  }


  //LIST Prescriptions NAMES Dropdown  PER PATIENT
  async getPrescriptionsDropDownByPatient(patientId: string): Promise<Prescriptions[]> {

    const prescriptionsNameList = await this.prescriptionsRepository.find({
      select: ["name"],
      where: { uuid: patientId },

    });
    return prescriptionsNameList
      ;
  }
  async getAllPrescriptions(): Promise<Prescriptions[]> {
    const prescriptions = await this.prescriptionsRepository.find();
    return prescriptions;
  }


  async updatePrescriptions(id: string,
    updatePrescriptionsInput: UpdatePrescriptionsInput,
  ): Promise<Prescriptions> {
    const { ...updateData } = updatePrescriptionsInput;
    const prescriptions = await this.prescriptionsRepository.findOne({ where: { uuid: id } });
    if (!prescriptions) {
      throw new NotFoundException(`Prescriptions ID-${id}  not found.`);
    }
    Object.assign(prescriptions, updateData);
    return this.prescriptionsRepository.save(prescriptions);
  }
  async softDeletePrescriptions(id: string): Promise<{ message: string, deletedPrescriptions: Prescriptions }> {
    // Find the patient record by ID
    const prescriptions = await this.prescriptionsRepository.findOne({ where: { uuid: id } });

    if (!prescriptions) {
      throw new NotFoundException(`Prescriptions ID-${id} does not exist.`);
    }

    // Set the deletedAt property to mark as soft deleted
    prescriptions.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedPrescriptions = await this.prescriptionsRepository.save(prescriptions);

    return { message: `Prescriptions with ID ${id} has been soft-deleted.`, deletedPrescriptions };

  }
}
