import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrescriptionInput } from './dto/create-prescription.input';
import { UpdatePrescriptionInput } from './dto/update-prescription.input';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { ILike, Repository } from 'typeorm';
import { Prescription } from './entities/prescription.entity';
import { IdService } from 'services/uuid/id.service'; // 

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
    private idService: IdService, // Inject the IdService
  ) { }
  //CREATE Prescription INFO
  async createPrescription(input: CreatePrescriptionInput): Promise<Prescription> {
    const existingLowercaseboth = await this.prescriptionRepository.findOne({
      where: {
        name: ILike(`%${input.name}%`),
        dosage: ILike(`%${input.dosage}%`),
        interval: ILike(`%${input.interval}%`),
        numDays: ILike(`%${input.numDays}%`),
        maintenance: (input.maintenance),
        patientId: (input.patientId)
      },

    });

    if (existingLowercaseboth) {
      throw new ConflictException('Prescription already exists.');
    }

    const newPrescription = new Prescription();

    const uuidPrefix = 'PRC-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);

    newPrescription.uuid = uuid;

    // Copy the properties from the input object to the new patient information
    Object.assign(newPrescription, input);

    return this.prescriptionRepository.save(newPrescription);
  }

  //PAGED Prescription list PER PATIENT
  async getAllPrescriptionsByPatient(patientId: number, page: number = 1, sortBy: string = 'lastName', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: Prescription[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const totalPatientPrescription = await this.prescriptionRepository.count({
      where: { patientId },
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientPrescription / perPage);
    const prescriptionList = await this.prescriptionRepository.find({
      where: { patientId },
      skip: skip,
      take: perPage,
    });
    return {
      data: prescriptionList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientPrescription
    };
  }
  async getAllPrescriptions(): Promise<Prescription[]> {
    const prescription = await this.prescriptionRepository.find();
    return prescription;
  }


  async updatePrescription(id: number,
    updatePrescriptionInput: UpdatePrescriptionInput,
  ): Promise<Prescription> {
    const { ...updateData } = updatePrescriptionInput;
    const prescription = await this.prescriptionRepository.findOne({ where: { id } });
    if (!prescription) {
      throw new NotFoundException(`Prescription ID-${id}  not found.`);
    }
    Object.assign(prescription, updateData);
    return this.prescriptionRepository.save(prescription);
  }
  async softDeletePrescription(id: number): Promise<{ message: string, deletedPrescription: Prescription }> {
    // Find the patient record by ID
    const prescription = await this.prescriptionRepository.findOne({ where: { id } });

    if (!prescription) {
      throw new NotFoundException(`Prescription ID-${id} does not exist.`);
    }

    // Set the deleted_at property to mark as soft deleted
    prescription.deleted_at = new Date().toISOString();

    // Save and return the updated patient record
    const deletedPrescription = await this.prescriptionRepository.save(prescription);

    return { message: `Prescription with ID ${id} has been soft-deleted.`, deletedPrescription };

  }
}
