import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Patch,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { CreatePrescriptionsInput } from './dto/create-prescriptions.input';
import { UpdatePrescriptionsInput } from './dto/update-prescriptions.input';
import { PrescriptionsService } from './prescriptions.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { getFileValidator } from 'services/fileValidator/getFileValidator';
import { PrescriptionFilesService } from 'src/prescriptionsFiles/prescriptionsFiles.service';
import { extname } from 'path';
import { Readable } from 'typeorm/platform/PlatformTools';
import { Response, application } from 'express';

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(
    private readonly prescriptionsService: PrescriptionsService,
    private prescriptionFilesService: PrescriptionFilesService,
  ) { }

  @Post('timechart')
  getPatientsWithMedicationLogsAndPrescriptions(
    @Body() body: { term: string; page: number },
  ) {
    const { term, page } = body;
    return this.prescriptionsService.getPatientsWithMedicationLogsAndPrescriptions(
      term,
      page,
    );
  }

  @Post(':id')
  createPrescriptions(
    @Param('id') patientId: string,
    @Body() createPrescriptionsInput: CreatePrescriptionsInput,
  ) {
    return this.prescriptionsService.createPrescriptions(
      patientId,
      createPrescriptionsInput,
    );
  }
  @Post('get/all')
  async getAllPrescriptions() {
    try {
      const prescriptions =
        await this.prescriptionsService.getAllPrescriptions();
      return { success: true, data: prescriptions };
    } catch (error) {
      // Handle any errors that occur during the operation
      return { success: false, message: error.message };
    }
  }
  @Post('list/:id')
  findAllPatientPrescriptions(
    @Param('id') patientId: string,
    @Body()
    body: {
      term: string;
      page: number;
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
    },
  ) {
    const { term = '', page, sortBy, sortOrder } = body;
    return this.prescriptionsService.getAllPrescriptionsByPatient(
      patientId,
      term,
      page,
      sortBy,
      sortOrder,
    );
  }
  //onClick from prescriptions- get prescriptionsId for patch
  @Patch('update/:id')
  updatePrescriptions(
    @Param('id') id: string,
    @Body() updatePrescriptionsInput: UpdatePrescriptionsInput,
  ) {
    return this.prescriptionsService.updatePrescriptions(
      id,
      updatePrescriptionsInput,
    );
  }

  @Patch('delete/:id')
  softDeletePrescriptions(@Param('id') id: string) {
    return this.prescriptionsService.softDeletePrescriptions(id);
  }

  //for sched med logs

  @Post('sched-meds-name/:id')
  getAllPrescriptionsByPatientForSchedMed(@Param('id') patientId: string) {
    return this.prescriptionsService.getAllPrescriptionsByPatientForSchedMed(
      patientId,
    );
  }
  //PrescriptionFile
  @Post(':id/upload')
  @UseInterceptors(FilesInterceptor('prescriptionFile', 5))
  addFile(
    @Param('id') id: string,
    @UploadedFiles(getFileValidator()) files: Array<Express.Multer.File>,
  ) {
    console.log(`Received ID: ${id}`);

    // Ensure that 'file' is defined before accessing its properties
    if (files && files.length > 0) {
      for (const file of files) {
        if (file) {
          // Process each file if it is defined
          this.prescriptionsService.addPrescriptionFile(
            id,
            file.buffer,
            file.originalname,
          );
        } else {
          // Handle undefined file elements
          console.warn('Undefined file element detected.');
        }
      }
      console.log(files);
    } else {
      // Handle the case where 'file' is undefined
      throw new BadRequestException('No file uploaded');
    }
  }
  @Patch('files/delete/:fileId')
    async deleteFile(@Param('fileId') fileUuid: string) {
    
        await this.prescriptionFilesService.softDeletePrescriptionFile(fileUuid);
        console.log(`Delete Prescription File`, fileUuid);
        return `Deleted Prescription File ${fileUuid} Successfully`;
    }
  @Post(':id/uploadfiles')
  @UseInterceptors(FilesInterceptor('prescriptionfile', 5))
  async addPrescriptionFile(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(`Received ID: ${id}`);

    if (!files || files.length === 0) {
      throw new BadRequestException('No file uploaded');
    }

    for (const file of files) {
      if (file) {
        await this.prescriptionsService.addPrescriptionFile(
          id,
          file.buffer,
          file.originalname,
        );
      } else {
        console.warn('Undefined file element detected.');
      }
    }
  }

  @Patch(':id/updatefile')
  @UseInterceptors(FilesInterceptor('prescriptionfile', 1))
  async updatePrescriptionFile(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(`Received ID: ${id}`);

    if (!files || files.length === 0) {
      throw new BadRequestException('No file uploaded');
    }

    const file = files[0]; // Since we expect only one file
    if (!file) {
      throw new BadRequestException('Invalid file uploaded');
    }

    return this.prescriptionsService.updatePrescriptionFile(
      id,
      file.buffer,
      file.originalname,
    );
  }

  @Get(':id/files')
  async getDatabaseFilesById(@Param('id') id: string) {
    const files = await this.prescriptionsService.getPrescriptionFilesByUuid(
      id,
    );

    if (files.length === 0) {
      return `No files found for prescription with UUID ${id}`;
    }

    const fileMetadataArray = files.map((file) => ({
      fileId: file.file_uuid,
      filename: file.filename,
      data: file.data,
    }));

    return fileMetadataArray;
  }
  @Get(':id/files/count') //get a list of files of that lab result
  async getCurrentFileCountFromDatabase(@Param('id') id: string, response: Response) {
    const files = await this.prescriptionsService.getCurrentFileCountFromDatabase(id);
    return files;
  }
  @Get(':id/files/:fileId')
  async getFileById(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Res() response: Response,
  ): Promise<Response> {
    const file =
      await this.prescriptionFilesService.getFileByPrescriptionFileUuid(
        fileId,
      );

    if (!file) {
      response
        .status(HttpStatus.NOT_FOUND)
        .send(`File with File ID ${fileId} not found`);
      return;
    }

    response.setHeader(
      'Content-Disposition',
      `inline; filename="${file.filename}"`,
    );
    const fileExtension = extname(file.filename).toLowerCase();
    let contentType: string;

    switch (fileExtension) {
      case '.jpeg':
      case '.jpg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.pdf':
        contentType = 'application/pdf';
        break;
      default:
        contentType = 'application/octet-stream';
    }

    response.setHeader('Content-Type', contentType);

    const fileStream = Readable.from(file.data);

    return fileStream.pipe(response);
  }
}
