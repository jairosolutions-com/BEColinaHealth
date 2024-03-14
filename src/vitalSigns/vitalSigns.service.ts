import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVitalSignInput } from './dto/create-vitalSigns.input';
import { UpdateVitalSignInput } from './dto/update-vitalSigns.input';
import { VitalSigns } from './entities/vitalSigns.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Repository } from 'typeorm';

@Injectable()
export class VitalSignsService {
  constructor(
    @InjectRepository(VitalSigns)
    private vitalSignsRepository: Repository<VitalSigns>,
    private idService: IdService, // Inject the IdService
  ) { }
  async createVitalSign(input: CreateVitalSignInput): Promise<VitalSigns> {

    const newVitalSign = new VitalSigns();

    const uuidPrefix = 'VTL-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);

    newVitalSign.uuid = uuid;

    Object.assign(newVitalSign, input);

    return this.vitalSignsRepository.save(newVitalSign);
  }

  //PAGED Prescriptions list PER PATIENT
  async getAllVitalSignsByPatient(patientId: string, page: number = 1, sortBy: string = 'lastName', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: VitalSigns[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const totalPatientVitalSign = await this.vitalSignsRepository.count({
      where: { uuid: patientId},
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientVitalSign / perPage);
    const vitalSignList = await this.vitalSignsRepository.find({
      where: { uuid: patientId},
      skip: skip,
      take: perPage,
    });
    return {
      data: vitalSignList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientVitalSign
    };
  }

  async getAllVitalSign(): Promise<VitalSigns[]> {
    const vitalSign = await this.vitalSignsRepository.find();
    return vitalSign;
  }


  async updateVitalSign(id: number,
    updateVitalSignInput: UpdateVitalSignInput,
  ): Promise<VitalSigns> {
    const { ...updateData } = updateVitalSignInput;
    const prescriptions = await this.vitalSignsRepository.findOne({ where: { id } });
    if (!prescriptions) {
      throw new NotFoundException(`VitalSign  ID-${id}  not found.`);
    }
    Object.assign(prescriptions, updateData);
    return this.vitalSignsRepository.save(prescriptions);
  }
  async softDeleteVitalSign(id: number): Promise<{ message: string, deletedVitalSign: VitalSigns }> {
    // Find the patient record by ID
    const prescriptions = await this.vitalSignsRepository.findOne({ where: { id } });

    if (!prescriptions) {
      throw new NotFoundException(`Prescriptions ID-${id} does not exist.`);
    }

    // Set the deletedAt property to mark as soft deleted
    prescriptions.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedVitalSign = await this.vitalSignsRepository.save(prescriptions);

    return { message: `Prescriptions with ID ${id} has been soft-deleted.`, deletedVitalSign };

  }
}
