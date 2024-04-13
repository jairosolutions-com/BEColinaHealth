import {
    BadRequestException,
    Body,
    Controller,
    Get,
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

        // Check if there are any files to render
        if (files.length === 0) {
            response.status(404).send(`No files found for lab result with UUID ${id}`);
            return;
        }

        // Iterate over each file in the array
        for (const file of files) {

            let contentType: string;
            const stream = Readable.from(file.data);

            // Set the appropriate headers
            response.set({
                'Content-Disposition': `inline; filename="${file.filename}"`,
                'Content-Type': 'application/zip',
            });

            //   Determine the file extension and set the content type
            const ext = extname(file.filename).toLowerCase();

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
                // Add more cases as needed for additional file types
                default:
                    // If the file type is not recognized, set a default content type
                    contentType = 'application/octet-stream'; // Default binary content type
            }


            // // Create a zip archive with the files
            // const archiver = require('archiver');
            // const archive = archiver('zip', { zlib: { level: 9 } });

            // // Set up the stream
            // response.on('close', () => {
            //     archive.destroy();
            // });

            // archive.on('error', (err: Error) => {
            //     throw err;
            // });

            // archive.pipe(response);

            // // Add files to the archive
            // files.forEach(file => {
            //     archive.append(file.data, { name: file.filename });
            // });

            // // Finalize the archive
            // await archive.finalize();
            // // Create a Readable stream from the file data
            // Create a readable stream from the file data

            // Stream the file to the client using StreamableFile
            await new Promise<void>((resolve) => {
                const file = createReadStream(join(process.cwd(), 'package.json'));

                stream.on('end', resolve);
                return new StreamableFile(file);

            });

        }
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

