import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrescriptionsInput } from './dto/create-prescriptions.input';
import { UpdatePrescriptionsInput } from './dto/update-prescriptions.input';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { Brackets, ILike, Like, Repository } from 'typeorm';
import { Prescriptions } from './entities/prescriptions.entity';
import { IdService } from 'services/uuid/id.service'; // 
import { Patients } from 'src/patients/entities/patients.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescriptions)
    private prescriptionsRepository: Repository<Prescriptions>,
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,

    private idService: IdService, // Inject the IdService
  ) { }
  //CREATE Prescriptions INFO
  async createPrescriptions(patientUuid: string, prescriptionData: CreatePrescriptionsInput): Promise<Prescriptions> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ["id"],
      where: { uuid: patientUuid }
    });
    const existingPrescriptions = await this.prescriptionsRepository.findOne({
      where: {
        name: Like(`%${prescriptionData.name}%`),
        patientId: patientId
      },
    });


    if (existingPrescriptions) {
      throw new ConflictException('Prescriptions already exists.');
    }

    const newPrescriptions = new Prescriptions();

    const uuidPrefix = 'PRC-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);

    newPrescriptions.uuid = uuid;
    newPrescriptions.patientId = patientId; // Assign patientId
    Object.assign(newPrescriptions, prescriptionData);
    const savedLabResult = await this.prescriptionsRepository.save(newPrescriptions);
    const result = { ...savedLabResult };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;
    return (result)
  }

  //PAGED Prescriptions list PER PATIENT
  async getAllPrescriptionsByPatient(patientUuid: string, term: string,
    page: number = 1, sortBy: string = 'status', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: Prescriptions[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const patientExists = await this.patientsRepository.findOne({ where: { uuid: patientUuid } });

    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
    const prescriptionsQueryBuilder = this.prescriptionsRepository
      .createQueryBuilder('prescriptions')
      .leftJoinAndSelect('prescriptions.patient', 'patient')
      .select([
        'prescriptions.uuid',
        'prescriptions.name',
        'prescriptions.status',
        'prescriptions.dosage',
        'prescriptions.frequency',
        'prescriptions.interval',
        'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .orderBy(`${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (term !== "") {
      console.log("term", term);
      prescriptionsQueryBuilder
        .where(new Brackets((qb) => {
          qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid })
        }))
        .andWhere(new Brackets((qb) => {
          qb.andWhere("prescriptions.uuid ILIKE :searchTerm", { searchTerm })
            .orWhere("prescriptions.name ILIKE :searchTerm", { searchTerm })
        }));
    }
    // Get lab results
    const prescriptionResultList = await prescriptionsQueryBuilder.getRawMany();
    const totalPatientLabResults = await prescriptionsQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientLabResults / perPage);

    return {
      data: prescriptionResultList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientLabResults,
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


  //for medical history logs scheduled

  async getAllPrescriptionsByPatientForSchedMed(patientUuid: string): Promise<{ data: Prescriptions[] }> {

    const prescriptionsQueryBuilder = this.prescriptionsRepository
      .createQueryBuilder('prescriptions')
      .leftJoinAndSelect('prescriptions.patient', 'patient')
      .select([
        'prescriptions.uuid',
        'prescriptions.name',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .andWhere('prescriptions.status = :status', { status: 'active' })
      .orderBy('prescriptions.name', 'ASC');

    // Get lab results
    const prescriptionResultList = await prescriptionsQueryBuilder.getRawMany();
    return {
      data: prescriptionResultList,
    };
  }
}
