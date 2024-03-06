import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVitalSignInput } from './dto/create-vital_sign.input';
import { UpdateVitalSignInput } from './dto/update-vital_sign.input';
import { VitalSigns } from './entities/vital_sign.entity';
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

  //PAGED Prescription list PER PATIENT
  async getAllVitalSignsByPatient(patientId: number, page: number = 1, sortBy: string = 'lastName', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: VitalSigns[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const totalPatientVitalSign = await this.vitalSignsRepository.count({
      where: { patientId },
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientVitalSign / perPage);
    const vitalSignList = await this.vitalSignsRepository.find({
      where: { patientId },
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
    const prescription = await this.vitalSignsRepository.findOne({ where: { id } });
    if (!prescription) {
      throw new NotFoundException(`VitalSign  ID-${id}  not found.`);
    }
    Object.assign(prescription, updateData);
    return this.vitalSignsRepository.save(prescription);
  }
  async softDeleteVitalSign(id: number): Promise<{ message: string, deletedVitalSign: VitalSigns }> {
    // Find the patient record by ID
    const prescription = await this.vitalSignsRepository.findOne({ where: { id } });

    if (!prescription) {
      throw new NotFoundException(`Prescription ID-${id} does not exist.`);
    }

    // Set the deleted_at property to mark as soft deleted
    prescription.deleted_at = new Date().toISOString();

    // Save and return the updated patient record
    const deletedVitalSign = await this.vitalSignsRepository.save(prescription);

    return { message: `Prescription with ID ${id} has been soft-deleted.`, deletedVitalSign };

  }
}
