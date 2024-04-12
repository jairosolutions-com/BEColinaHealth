import { Injectable, NotFoundException } from '@nestjs/common';
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
    


  ) { }

  async uploadLabResultFile(dataBuffer: Buffer, filename: string) {
    const newFile = await this.labResultsFilesRepository.create({
      file_uuid: this.idService.generateRandomUUID("LRF-"),
      filename,
      data: dataBuffer
    })
    await this.labResultsFilesRepository.save(newFile);
    return newFile;
  }

  async getFileByLabUuid(labResultUuid: string) {
    const labResultFilesQueryBuilder = this.labResultsRepository
      .createQueryBuilder('labResults')
      .innerJoinAndSelect('labResults.labFile', 'labFile')
      .select([
        'labResults.labFileId',
      ])
      .where('labResults.uuid = :uuid', { uuid: labResultUuid })
    const labResultFileId = await labResultFilesQueryBuilder.getRawOne();
    if (!labResultFileId) {
      throw new NotFoundException();
    }
    const file = await this.labResultsFilesRepository.findOne({
      where: { id: labResultFileId },
    });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

}
