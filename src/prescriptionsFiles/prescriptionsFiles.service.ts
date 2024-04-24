import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PrescriptionsFiles } from './entities/prescriptionsFiles.entity';
import { IdService } from 'services/uuid/id.service'; // Import the IdService

@Injectable()
export class PrescriptionFilesService {
  constructor(
    @InjectRepository(PrescriptionsFiles)
    private prescriptionFilesRepository: Repository<PrescriptionsFiles>,
    @InjectRepository(Prescriptions)
    private prescriptionsRepository: Repository<Prescriptions>,
    private idService: IdService, // Inject the IdService
  ) {}

  async uploadPrescriptionFile(dataBuffer: Buffer, filename: string, prescriptionsId: number) {
    const newFile = await this.prescriptionFilesRepository.create({
      file_uuid: this.idService.generateRandomUUID("PRF-"), // Generate UUID for file_uuid
      prescriptionsId: prescriptionsId,
      filename,
      data: dataBuffer,
    });
    await this.prescriptionFilesRepository.save(newFile);
    return newFile;
  }

  async getPrescriptionFilesByPrescriptionId(prescriptionsId: number) {
    const files = await this.prescriptionFilesRepository.find({
      where: { prescriptionsId: prescriptionsId },
    });
    if (!files) {
      throw new NotFoundException(`No prescription files found for prescription ID ${prescriptionsId}`);
    }
    return files;
  }

  async getFileByPrescriptionFileUuid(prescriptionsUuid: string) {
    const { id: prescriptionsId } = await this.prescriptionFilesRepository.findOne({
      select: ['id'],
      where: { file_uuid: prescriptionsUuid }, // Check if prescriptionsUuid is the correct field
    });
    const file = await this.prescriptionFilesRepository.findOne({
      where: { prescriptionsId: prescriptionsId },
    });
    if (!file) {
      throw new NotFoundException(`Prescription file not found for UUID ${prescriptionsUuid}`);
    }
    return file;
  }

  async softDeletePrescriptionFile(prescriptionFileUuid: string): Promise<PrescriptionsFiles> {
    console.log(`Delete Prescription File`, prescriptionFileUuid);

    const prescriptionFile = await this.prescriptionFilesRepository.findOne({ where: { file_uuid: prescriptionFileUuid } });

    if (!prescriptionFile) {
      throw new NotFoundException(`Prescription file with UUID ${prescriptionFileUuid} not found.`);
    }

    prescriptionFile.deletedAt = new Date().toISOString();

    try {
      return await this.prescriptionFilesRepository.save(prescriptionFile);
    } catch (error) {
      console.error(`Error saving prescription file with UUID ${prescriptionFileUuid}:`, error);
      throw new Error(`Failed to soft delete prescription file with UUID ${prescriptionFileUuid}`);
    }
  }

  async updatePrescriptionFile(prescriptionsId: number, imageBuffer: Buffer, filename: string): Promise<PrescriptionsFiles> {
    // Retrieve the existing prescription file associated with the prescriptions ID
    const existingPrescriptionFile = await this.prescriptionFilesRepository.findOne({
      where: { prescriptionsId: prescriptionsId },
    });

    // Handle the case where the existing prescription file is not found
    if (!existingPrescriptionFile) {
      throw new BadRequestException(`No existing prescription file found for prescriptions ID ${prescriptionsId}`);
    }

    // Update the existing prescription file's buffer and filename
    existingPrescriptionFile.data = imageBuffer;
    existingPrescriptionFile.filename = filename;

    // Save the updated prescription file back to the repository
    const updatedPrescriptionFile = await this.prescriptionFilesRepository.save(existingPrescriptionFile);

    // Handle the case where the prescription file update fails
    if (!updatedPrescriptionFile) {
      throw new BadRequestException(`Failed to update prescription file for prescriptions ID ${prescriptionsId}`);
    }

    console.log(`Prescription file updated successfully: ${updatedPrescriptionFile}`);

    // Return the updated prescription file
    return updatedPrescriptionFile;
  }
}
