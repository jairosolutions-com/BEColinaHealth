import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormFiles } from './entities/./formFiles.entity';
import { IdService } from 'services/uuid/id.service'; // Import the IdService

@Injectable()
export class FormsFilesService {
  constructor(
    @InjectRepository(FormFiles)
    private formsFilesRepository: Repository<FormFiles>,
    private idService: IdService, // Inject the IdService
  ) { }

  async uploadFormFile(dataBuffer: Buffer, filename: string, formId: number) {
    const newFile = await this.formsFilesRepository.create({
      file_uuid: this.idService.generateRandomUUID("FRF-"),
      formsId: formId,
      filename,
      data: dataBuffer,
    });
    await this.formsFilesRepository.save(newFile);
    return newFile;
  }
  async getFilesByFormId(formId: number) {
    const files = await this.formsFilesRepository.find({
      where: { formsId: formId },
    });
    if (!files || files.length === 0) {
      throw new NotFoundException(`No files found for form with ID ${formId}`);
    }
    return files;
  }

  async getFileByFormFileUuid(formFileUuid: string) {
    const { id: formFileId } = await this.formsFilesRepository.findOne({
      select: ['id'],
      where: { file_uuid: formFileUuid },
    });
    if (!formFileId) {
      throw new NotFoundException(`Form file with UUID ${formFileUuid} not found`);
    }

    const file = await this.formsFilesRepository.findOne({
      where: { id: formFileId },
    });    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
  
  async softDeleteFormFile(formFileUuid: string): Promise<FormFiles> {
    console.log(`Delete Form File`, formFileUuid);

    const formFile = await this.formsFilesRepository.findOne({ where: { file_uuid: formFileUuid } });

    if (!formFile) {
      throw new NotFoundException(`Form File ID-${formFileUuid} not found.`);
    }

    formFile.deletedAt = new Date().toISOString();

    try {
      return await this.formsFilesRepository.save(formFile);
    } catch (error) {
      console.error(`Error saving form file with UUID ${formFileUuid}:`, error);
      throw new Error(`Failed to soft delete form file with UUID ${formFileUuid}`);
    }
  }

  async updateFormFile(formId: number, dataBuffer: Buffer, filename: string): Promise<FormFiles> {
    const existingFormFile = await this.formsFilesRepository.findOne({
      where: { formsId: formId }
    });

    if (!existingFormFile) {
      throw new BadRequestException(`No existing form file found for form ID ${formId}`);
    }

    // existingFormFile.data = dataBuffer;
    // existingFormFile.filename = filename;

    const updatedFormFile = await this.formsFilesRepository.save(existingFormFile);

    if (!updatedFormFile) {
      throw new BadRequestException(`Failed to update form file for form ID ${formId}`);
    }

    console.log(`Form file updated successfully: ${updatedFormFile}`);

    return updatedFormFile;
  }
}
