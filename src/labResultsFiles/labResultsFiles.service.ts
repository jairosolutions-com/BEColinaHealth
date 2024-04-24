import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabResultsFileDto } from './dto/create-labResultsFiles.dto';
import { UpdateLabResultsFileDto } from './dto/update-labResultsFiles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import LabResultsFiles from './entities/labResultsFiles.entity';
import { IdService } from 'services/uuid/id.service'; //

@Injectable()
export class LabResultsFilesService {
  constructor(
    @InjectRepository(LabResultsFiles)
    private labResultsFilesRepository: Repository<LabResultsFiles>,
    @InjectRepository(LabResults)
    private labResultsRepository: Repository<LabResults>,
    private idService: IdService, // Inject the IdService
  ) {}

  async uploadLabResultFile(dataBuffer: Buffer, filename: string, labResultsId: number) {
    const newFile = await this.labResultsFilesRepository.create({
      file_uuid: this.idService.generateRandomUUID("LRF-"),
      labResultsId: labResultsId,
      filename,
      data: dataBuffer,
    });
    await this.labResultsFilesRepository.save(newFile);
    return newFile;
  }

  

  async getLabFilesByLabId(labResultId: number) {
    const file = await this.labResultsFilesRepository.find({
      where: { labResultsId: labResultId },
    });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }


  async getFileByLabFileUuid(labFileUuid: string) {
    const { id: labFileId } = await this.labResultsFilesRepository.findOne({
      select: ['id'],
      where: { file_uuid: labFileUuid },
    });
    const file = await this.labResultsFilesRepository.findOne({
      where: { id: labFileId },
    });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
//   async softDeleteLabFiles(fileUuids: string[]): Promise<void> {
//     // Iterate through each file ID in the array
//     for (const fileId of fileUuids) {
//         // Perform the soft delete operation on the fileId
//         // For example, update the file status in the database
//         await this.softDeleteLabFile(fileId);
//     }
// }
async softDeleteLabFile(labFileUuid: string): Promise<LabResultsFiles> {

  console.log(`Delete Lab File`, labFileUuid );

  const labFile = await this.labResultsFilesRepository.findOne({ where: { file_uuid: labFileUuid } });

  if (!labFile) {
      throw new NotFoundException(`Lab File ID-${labFileUuid} not found.`);
  }

  labFile.deletedAt = new Date().toISOString();

  try {
      return await this.labResultsFilesRepository.save(labFile);
  } catch (error) {
      console.error(`Error saving lab file with UUID ${labFileUuid}:`, error);
      throw new Error(`Failed to soft delete lab file with UUID ${labFileUuid}`);
  }
}

  async updateLabFile(labResultsId: number, imageBuffer: Buffer, filename: string): Promise<LabResultsFiles> {
    // Retrieve the existing lab file associated with the lab result ID
    const existingLabFile = await this.labResultsFilesRepository.findOne({
        where: { labResultsId }
    });

    // Handle the case where the existing lab file is not found
    if (!existingLabFile) {
        throw new BadRequestException(`No existing lab file found for lab result ID ${labResultsId}`);
    }

    // Update the existing lab file's buffer and filename
    existingLabFile.data = imageBuffer;
    existingLabFile.filename = filename;


    // Save the updated lab file back to the repository
    const updatedLabFile = await this.labResultsFilesRepository.save(existingLabFile);

    // Handle the case where the lab file update fails
    if (!updatedLabFile) {
        throw new BadRequestException(`Failed to update lab file for lab result ID ${labResultsId}`);
    }

    console.log(`Lab file updated successfully: ${updatedLabFile}`);

    // Return the updated lab file
    return updatedLabFile;
}
}
