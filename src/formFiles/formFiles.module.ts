import { Module } from '@nestjs/common';
import { FormFilesService } from './formFiles.service';
import { FormFilesController } from './formFiles.controller';

@Module({
  controllers: [FormFilesController],
  providers: [FormFilesService],
})
export class FormFilesModule { }
