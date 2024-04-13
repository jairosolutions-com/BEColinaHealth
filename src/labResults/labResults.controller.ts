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
    UseInterceptors,
} from '@nestjs/common';
import { LabResultsService } from './labResults.service';
import { CreateLabResultInput } from './dto/create-labResults.input';
import { UpdateLabResultInput } from './dto/update-labResults.input';
import { FileInterceptor } from '@nestjs/platform-express';
import { LabResultsFilesService } from 'src/labResultsFiles/labResultsFiles.service';
import { Response } from 'express';

import { Readable } from 'typeorm/platform/PlatformTools';
import { extname } from 'path';

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
    @UseInterceptors(FileInterceptor('labfile'))
    addLabFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        // Ensure that 'file' is defined before accessing its properties
        if (file) {
            this.labResultsService.addPatientLabFile(id, file.buffer, file.originalname);
            console.log(file);
        } else {
            // Handle the case where 'file' is undefined
            throw new BadRequestException('No file uploaded');
        }
    }
    @Get(':id/file')
    async getDatabaseFileById(@Param('id') id: string, @Res({ passthrough: true }) response: Response) {
        const file = await this.labResultsFilesService.getFileByLabUuid(id);
        const stream = Readable.from(file.data);
        let contentType;

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

        // Set the appropriate 'Content-Type' header
        response.set({
            'Content-Disposition': `inline; filename="${file.filename}"`,
            'Content-Type': contentType
        });
        return new StreamableFile(stream);
    }
}

