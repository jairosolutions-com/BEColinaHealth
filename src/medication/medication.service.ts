import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicationInput } from './dto/create-medication.input';
import { UpdateMedicationInput } from './dto/update-medication.input';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { ILike, Repository } from 'typeorm';
import { Medication } from './entities/medication.entity';
import { Prescription } from 'src/prescription/entities/prescription.entity';

@Injectable()
export class MedicationService {
  constructor(

    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    private idService: IdService, // Inject the IdService
  ) { }

  async createMedication(input: CreateMedicationInput):
    Promise<{ Medication, message: string }> {
    var message = "";

    const existingLowercaseboth = await this.medicationRepository.findOne({
      where: {
        medicationName: ILike(`%${input.medicationName}%`),
        medicationDate: ILike(`%${input.medicationDate}%`),
        medicationStatus: ILike(`%${input.medicationStatus}%`),
        medicationTime: ILike(`%${input.medicationTime}%`),
        patientId: (input.patientId)
      },

    });

    if (existingLowercaseboth) {
      throw new ConflictException('Medication already exists.');
    }

    // Find the matching prescription based on medicationName and patientId
    const prescription = await this.prescriptionRepository.findOne({
      where: { name: ILike(`%${input.medicationName}%`), patientId: input.patientId },
    });
    const newMedication = new Medication();
    if (!prescription) {
      message = "Not prescribed but added to medication log";
      newMedication.prescriptionId = null;
    }
    else {
      newMedication.prescriptionId = prescription.id;
    }


    const uuidPrefix = 'MDC-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newMedication.uuid = uuid;

    Object.assign(newMedication, input);
    this.medicationRepository.save(newMedication);
    return {
      Medication: newMedication,
      message: message
    };
  }

  async getAllMedicationsByPatient(patientId: number, page: number = 1, sortBy: string = 'medicationDate', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: Medication[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    const totalPatientMedication = await this.medicationRepository.count({
      where: { patientId },
      skip: skip,
      take: perPage,
    });
    const totalPages = Math.ceil(totalPatientMedication / perPage);
    const medicationList = await this.medicationRepository.find({
      where: { patientId },
      relations: [
        'prescription',
      ],
      skip: skip,
      take: perPage,
    });
    return {
      data: medicationList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientMedication
    };
  }

  // async getPrescriptionByMedication(id: number, page: number = 1, sortBy: string = 'medicationDate', sortOrder: 'ASC' | 'DESC' = 'ASC', perPage: number = 5): Promise<{ data: Medication[], totalPages: number, currentPage: number, totalCount }> {
  //   const skip = (page - 1) * perPage;
  //   const totalPatientMedication = await this.medicationRepository.count({
  //     where: { prescriptionId: id },
  //     skip: skip,
  //     take: perPage,
  //   });
  //   const totalPages = Math.ceil(totalPatientMedication / perPage);
  //   const medicationList = await this.medicationRepository.find({
  //     where: { prescriptionId: id },
  //     relations: [
  //       'prescription',
  //     ],
  //     skip: skip,
  //     take: perPage,
  //   });
  //   return {
  //     data: medicationList,
  //     totalPages: totalPages,
  //     currentPage: page,
  //     totalCount: totalPatientMedication
  //   };
  // }
  async getAllMedication(): Promise<Medication[]> {
    const medication = await this.medicationRepository.find();
    return medication;
  }
  async updateMedication(id: number,
    updateMedicationInput: UpdateMedicationInput,
  ): Promise<Medication> {
    const { ...updateData } = updateMedicationInput;
    const medication = await this.medicationRepository.findOne({ where: { id } });
    if (!medication) {
      throw new NotFoundException(`Medication ID-${id}  not found.`);
    }
    Object.assign(medication, updateData);
    return this.medicationRepository.save(medication);
  }
  async softDeleteMedication(id: number): Promise<{ message: string, deletedMedication: Medication }> {
    // Find the patient record by ID
    const medication = await this.medicationRepository.findOne({ where: { id } });

    if (!medication) {
      throw new NotFoundException(`Medication ID-${id} does not exist.`);
    }

    // Set the deleted_at property to mark as soft deleted
    medication.deleted_at = new Date().toISOString();

    // Save and return the updated patient record
    const deletedMedication = await this.medicationRepository.save(medication);

    return { message: `Medication with ID ${id} has been soft-deleted.`, deletedMedication };

  }
}
