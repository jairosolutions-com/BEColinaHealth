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
    softDeletePrescriptions(@Param('id') id: string) {
        return this.labResultsService.softDeleteLabResults(id);
    }

    //labFile
    @Post(':id/upload')
    @UseInterceptors(FilesInterceptor('labfile', 5))
    addLabFile(@Param('id') id: string, @UploadedFiles(getFileValidator()) files: Array<Express.Multer.File>) {
        // Ensure that 'file' is defined before accessing its properties
        if (files && files.length > 0) {
            for (const file of files) {
                if (file) {
                    // Process each file if it is defined
                    this.labResultsService.addPatientLabFile(id, file.buffer, file.originalname);
                    console.log(file);
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
    @Get(':id/file')
    async getDatabaseFilesById(@Param('id') id: string, @Res({ passthrough: true }) response: Response) {
        // Retrieve an array of files associated with the given lab result UUID
        const files = await this.labResultsFilesService.getFileByLabUuid(id);
        console.log(files)
        // Check if there are any files to render
        if (files.length === 0) {
            response.status(404).send(`No files found for lab result with UUID ${id}`);
            return;
        }
        response.setHeader('Content-Disposition', `inline; filename="${files[0].filename}"`);
        const ext = extname(files[0].filename).toLowerCase();
        let contentType: string;

        switch (ext) {
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


        // Iterate over each file in the array
        for (const file of files) {
            const stream = Readable.from(file.data);

            // // Determine the file extension and set the content type
            // const ext = extname(file.filename).toLowerCase();

            // Stream the file to the client
            stream.pipe(response, { end: false });

            // Add a delay between files if necessary (optional)
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // End the response when done
        response.end();
    }
    @Get(':id/files')

    async getDatabaseFileszById(@Param('id') id: string, @Res() response: Response): Promise<void> {
        // Retrieve an array of files associated with the given lab result UUID
        // Retrieve an array of files associated with the given lab result UUID
        const files = await this.labResultsFilesService.getFileByLabUuid(id);

        // Check if there are any files to render
        if (files.length === 0) {
            response.status(HttpStatus.NOT_FOUND).send(`No files found for lab result with UUID ${id}`);
            return;
        }

        // Iterate over each file in the array and stream them one by one
        for (const file of files) {
            // Create a readable stream from the file data
            const fileStream = Readable.from(file.data);

            // Determine the file extension and set the content type
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

            // Set headers for the file
            response.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
            response.setHeader('Content-Type', contentType);

            // Use StreamableFile to manage the streaming of the file
            // const streamableFile = new StreamableFile(fileStream);

            // Stream the file to the client
            // streamableFile.pipe(response, { end: false });
            fileStream.pipe(response, { end: false });

            // Add a delay between files if necessary (optional)
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // End the response when done
        response.end();
    }
    @Get(':id/filez')
    async getFile(@Param('id') id: string, @Res() response: Response): Promise<void> {
        const files = await this.labResultsFilesService.getFileByLabUuid(id);
        const fileList = [];
        const arrRes = [];

        // Check if there are any files to render
        if (files.length === 0) {
            response.status(HttpStatus.NOT_FOUND).send(`No files found for lab result with UUID ${id}`);
            return;
        }

        // Iterate over each file in the array and stream them one by one
        for (const file of files) {
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

            // Set headers for the file

            fileList.push(file);

        }
        // Create a readable stream from the file data
        for (const filez of fileList) {
            console.log(filez.filename)
            const fileStream= Readable.from(filez.data);

            arrRes.push(fileStream);

            for (const file of arrRes) {
                fileStream.pipe(response, { end: false });

            }
            // Add a delay between files if necessary (optional)
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Pipe the file stream to the response


        // End the response after all files have been streamed
        response.end();
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

