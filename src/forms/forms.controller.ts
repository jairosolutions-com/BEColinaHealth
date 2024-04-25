import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, UploadedFiles, BadRequestException, HttpStatus } from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Response, application } from 'express';
import { extname } from 'path';
import { FormsFilesService } from 'src/formFiles/formFiles.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { getFileValidator } from 'services/fileValidator/getFileValidator';
import { Readable } from 'typeorm/platform/PlatformTools';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService,
    private readonly formsFilesService: FormsFilesService) { }

  @Post(':id')
  createForm(@Param('id') patientId: string, @Body() createFormDto: CreateFormDto) {
    return this.formsService.createForm(patientId, createFormDto);
  }

  @Post('list/:id')
  findAllPatientForms(
    @Param('id') patientId: string,
    @Body() body: { term: string; page: number; sortBy: string; sortOrder: 'ASC' | 'DESC' },
  ) {
    const { term = '', page, sortBy, sortOrder } = body;
    return this.formsService.getAllFormsByPatient(patientId, term, page, sortBy, sortOrder);
  }

  @Patch('update/:id')
  updateForm(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formsService.updateForm(id, updateFormDto);
  }

  @Patch('delete/:id')
  softDeleteForm(@Param('id') id: string) {
    return this.formsService.softDeleteForm(id);
  }

  @Post(':id/uploadfiles')
  @UseInterceptors(FilesInterceptor('formfile', 5)) // 'formfile' should match the field name in the form data
  async addFormFile(@Param('id') id: string, @UploadedFiles(getFileValidator()) files: Array<Express.Multer.File>) {
    console.log(`Received ID: ${id}`);

    // Ensure that 'files' is defined before accessing its properties
    if (files && files.length > 0) {
      for (const file of files) {
        if (file) {
          // Process each file if it is defined
          await this.formsService.addFormFile(id, file.buffer, file.originalname);
        } else {
          // Handle undefined file elements
          console.warn('Undefined file element detected.');
        }
      }
      console.log(files);
    } else {
      // Handle the case where 'files' is undefined
      throw new BadRequestException('No file uploaded');
    }
  }

  @Patch(':id/updatefile')
  @UseInterceptors(FilesInterceptor('formfile', 1)) // Limiting to 1 file upload at a time
  async updateFormFile(@Param('id') id: string, @UploadedFiles(getFileValidator()) files: Array<Express.Multer.File>) {
    console.log(`Received ID: ${id}`);

    // Check if a file has been uploaded
    if (files && files.length > 0) {
      const file = files[0]; // Since we expect only one file
      if (file) {
        // Call the service method to update the form file
        const updatedFormFile = await this.formsService.updateFormFile(id, file.buffer, file.originalname);

        console.log(`Form file updated: ${updatedFormFile}`);
        return updatedFormFile;
      } else {
        // Handle undefined file
        console.warn('Undefined file detected.');
        throw new BadRequestException('Invalid file uploaded');
      }
    } else {
      // Handle the case where no file was uploaded
      throw new BadRequestException('No file uploaded');
    }
  }
  @Get(':id/files') //get a list of files of that lab result
  async getDatabaseFilesById(@Param('id') id: string, response: Response) {
      const files = await this.formsService.getFormFilesByUuid(id);

      if (files.length === 0) {
          return (`No files found for with UUID ${id}`);
      }

      // Return an array of file metadata (e.g., file IDs, filenames, file types)
      const fileMetadataArray = files.map(file => ({
          fileId: file.file_uuid,
          filename: file.filename,
          data: file.data,

      }));

      return fileMetadataArray;
  }
  @Get(':id/files/count')
  async getCurrentFileCountFromDatabase(@Param('id') id: string, @Res() response: Response) {
    const files = await this.formsService.getCurrentFileCountFromDatabase(id);
    return files;
  }

  async getFileById(@Param('id') id: string, @Param('fileId') fileId: string, @Res() response: Response): Promise<Response> {

    const file = await this.formsFilesService.getFileByFormFileUuid(fileId);

    if (!file) {
        response.status(HttpStatus.NOT_FOUND).send(`File with File ID ${fileId} not found`);
        return;
    }


    // Set appropriate headers
    response.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
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

    // Create a readable stream from the file data
    const fileStream = Readable.from(file.data);

    // Pipe the file stream to the response

    return fileStream.pipe(response);
}
  @Patch('files/delete/:fileId')
  async softDeleteFormFiles(@Param('fileId') fileUuid: string) {
    await this.formsService.softDeleteForm(fileUuid);
    console.log(`Delete Form File`, fileUuid);
    return `Deleted Form File ${fileUuid} Successfully`;
  }
}
