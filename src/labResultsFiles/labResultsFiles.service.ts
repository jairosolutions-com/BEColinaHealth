import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabResultsFileDto } from './dto/create-labResultsFiles.dto';
import { UpdateLabResultsFileDto } from './dto/update-labResultsFiles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import LabResultsFiles from './entities/labResultsFiles.entity';

@Injectable()
export class LabResultsFilesService {
  constructor(
    @InjectRepository(LabResultsFiles)
    private labResultsFilesRepository: Repository<LabResultsFiles>,
  ) { }

  async uploadLabResultFile(dataBuffer: Buffer, filename: string) {
    const newFile = await this.labResultsFilesRepository.create({
      filename,
      data: dataBuffer
    })
    await this.labResultsFilesRepository.save(newFile);
    return newFile;
  }

  async getFileById(fileId: number) {
    const file = await this.labResultsFilesRepository.findOne({
      where: { id: fileId },
    });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
}
