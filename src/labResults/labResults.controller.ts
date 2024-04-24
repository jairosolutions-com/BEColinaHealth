import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,

    ParseIntPipe,

    Patch,
    Post,

    Res,

    StreamableFile,

    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import * as fs from 'fs';

import { LabResultsService } from './labResults.service';
import { CreateLabResultInput } from './dto/create-labResults.input';
import { UpdateLabResultInput } from './dto/update-labResults.input';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { LabResultsFilesService } from 'src/labResultsFiles/labResultsFiles.service';
import { Response, application } from 'express';

import { Readable } from 'typeorm/platform/PlatformTools';
import { extname, join } from 'path';
import { getFileValidator } from 'services/fileValidator/getFileValidator';
import archiver from 'archiver';
import { createReadStream } from 'fs';

@Controller('lab-results')
export class LabResultsController {
    constructor(private readonly labResultsService: LabResultsService,
        private readonly labResultsFilesService: LabResultsFilesService) { }
    @Post(':id')
    createLabResult(@Param('id') patientId: string,
        @Body() createLabResultInput: CreateLabResultInput) {
        return this.labResultsService.createLabResults(patientId, createLabResultInput);
    }
    @Post('get/all')
    getLabResults() {
        return this.labResultsService.getAllLabResults();
    }
    @Post('list/:id')
    findAllLabResultsByPatient(
        @Param('id') patientId: string,
        @Body() body: { term: string, page: number, sortBy: string, sortOrder: 'ASC' | 'DESC' }
    ) {
        const { term = "", page, sortBy, sortOrder } = body;
        return this.labResultsService.getAllLabResultsByPatient(term, patientId, page, sortBy, sortOrder);
    }
    @Patch('update/:id')
    updateLabResults(@Param('id') id: string, @Body() updateLabResultInput: UpdateLabResultInput) {
        return this.labResultsService.updateLabResults(id, updateLabResultInput);
    }
    @Patch('delete/:id')
    softDeleteLabResult(@Param('id') id: string) {
        return this.labResultsService.softDeleteLabResults(id);
    }

    //labFile
    @Post(':id/uploadfiles')
    @UseInterceptors(FilesInterceptor('labfile', 5))
    addLabFile(@Param('id') id: string, @UploadedFiles(getFileValidator()) files: Array<Express.Multer.File>) {
        console.log(`Received ID: ${id}`);

        // Ensure that 'file' is defined before accessing its properties
        if (files && files.length > 0) {
            for (const file of files) {
                if (file) {
                    // Process each file if it is defined
                    this.labResultsService.addPatientLabFile(id, file.buffer, file.originalname);
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
    @Patch(':id/updatefile')
    @UseInterceptors(FilesInterceptor('labfile', 1)) // Limiting to 1 file upload at a time
    updateLabFile(@Param('id') id: string, @UploadedFiles(getFileValidator()) files: Array<Express.Multer.File>) {
        console.log(`Received ID: ${id}`);

        // Check if a file has been uploaded
        if (files && files.length > 0) {
            const file = files[0]; // Since we expect only one file
            if (file) {
                // Call the service method to update the lab file
                const updatedLabFile = this.labResultsService.updatePatientLabFile(id, file.buffer, file.originalname);

                console.log(`Lab file updated: ${updatedLabFile}`);
                return updatedLabFile;
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
        const files = await this.labResultsService.getPatientLabFileByUuid(id);

        if (files.length === 0) {
            return (`No files found for lab result with UUID ${id}`);
        }

        // Return an array of file metadata (e.g., file IDs, filenames, file types)
        const fileMetadataArray = files.map(file => ({
            fileId: file.file_uuid,
            filename: file.filename,
            data: file.data,

        }));

        return fileMetadataArray;
    }
    @Get(':id/files/count') //get a list of files of that lab result
    async getCurrentFileCountFromDatabase(@Param('id') id: string, response: Response) {
        const files = await this.labResultsService.getCurrentFileCountFromDatabase(id);
        return files;
    }
    @Get(':id/files/:fileId') //get a list of files of that lab result
    async getFileById(@Param('id') id: string, @Param('fileId') fileId: string, @Res() response: Response): Promise<Response> {

        const file = await this.labResultsFilesService.getFileByLabFileUuid(fileId);

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
    // Updated softDeleteLabFiles function
    @Patch('files/delete/:fileId')
    async softDeleteLabFiles(@Param('fileId') fileUuid: string) {
    
        await this.labResultsFilesService.softDeleteLabFile(fileUuid);
        console.log(`Delete Lab File`, fileUuid);
        return `Deleted Lab File ${fileUuid} Successfully`;
    }
}
//SINGLE FILE VIEW
// async getDatabaseFileById(@Param('id') id: string, @Res({ passthrough: true }) response: Response) { 
//     const file = await this.labResultsFilesService.getFileByLabUuid(id);
//     const stream = Readable.from(file.data);
//     let contentType;

//     const ext = extname(file.filename).toLowerCase();
//     switch (ext) {
//         case '.jpeg':
//         case '.jpg':
//             contentType = 'image/jpeg';
//             break;
//         case '.png':
//             contentType = 'image/png';
//             break;
//         case '.pdf':
//             contentType = 'application/pdf';
//             break;
//         // Add more cases as needed for additional file types
//         default:
//             // If the file type is not recognized, set a default content type
//             contentType = 'application/octet-stream'; // Default binary content type
//     }

//     // Set the appropriate 'Content-Type' header
//     response.set({
//         'Content-Disposition': `inline; filename="${file.filename}"`,
//         'Content-Type': contentType
//     });
//     return new StreamableFile(stream);
// }
 
