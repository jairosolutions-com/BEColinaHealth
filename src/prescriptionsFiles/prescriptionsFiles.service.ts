import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabResultsFileDto } from './dto/create-labResultsFiles.dto';
import { UpdateLabResultsFileDto } from './dto/update-prescriptionsFiles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import LabResultsFiles from './entities/prescriptionsFiles.entity';
import { IdService } from 'services/uuid/id.service'; //

@Injectable()

export class LabResultsFilesService {
  constructor(
    @InjectRepository(LabResultsFiles)
    private labResultsFilesRepository: Repository<LabResultsFiles>,
    @InjectRepository(LabResults)
    private labResultsRepository: Repository<LabResults>,
    private idService: IdService, // Inject the IdService



  ) { }

  async uploadLabResultFile(dataBuffer: Buffer, filename: string, labResultsId: number) {
    const newFile = await this.labResultsFilesRepository.create({
      file_uuid: this.idService.generateRandomUUID("LRF-"),
      labResultsId: labResultsId,
      filename,
      data: dataBuffer,
    })
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

}
