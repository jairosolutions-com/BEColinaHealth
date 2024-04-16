import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { Repository } from 'typeorm';
import { PrescriptionsFiles } from './entities/prescriptionsFiles.entity';

@Injectable()

export class PrescriptionFilesService {
    constructor(
        @InjectRepository(PrescriptionsFiles)
        private prescriptionFilesRepository: Repository<PrescriptionsFiles>,
        @InjectRepository(Prescriptions)
        private prescriptionsRepository: Repository<Prescriptions>,

        private idService: IdService, // Inject the IdService

    ) { }


    async uploadPrescriptionFile(dataBuffer: Buffer, filename: string, prescriptionsId: number) {
        const newFile = await this.prescriptionFilesRepository.create({
            file_uuid: this.idService.generateRandomUUID("PRF-"),
            prescriptionsId: prescriptionsId,
            filename,
            data: dataBuffer,
        })
        await this.prescriptionFilesRepository.save(newFile);
        return newFile;
    }   

    async getPrescriptionFilesByPrescriptionId(prescriptionsId: number) {
        const file = await this.prescriptionFilesRepository.find({
          where: { prescriptionsId: prescriptionsId   },
        });
        if (!file) {
          throw new NotFoundException();
        }
        return file;
      }

      async getFileByPrescriptionFileUuid(prescriptionsUuid: string) {
        const { id: prescriptionsId } = await this.prescriptionFilesRepository.findOne({
          select: ['id'],
          where: { file_uuid: prescriptionsUuid },
        });
        const file = await this.prescriptionFilesRepository.findOne({
          where: { id: prescriptionsId   },
        });
        if (!file) {
          throw new NotFoundException();
        }
        return file;
      }
}

