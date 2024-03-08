import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LabResultsService } from './labResults.service';
import { CreateLabResultInput } from './dto/create-labResults.input';
import { UpdateLabResultInput } from './dto/update-labResults.input';

@Controller('lab-results')
export class LabResultsController {
    constructor(private readonly labResultsService: LabResultsService) { }
    @Post()
    createLabResult(@Body() createLabResultInput: CreateLabResultInput) {
        return this.labResultsService.createLabResults(createLabResultInput);
    }
    @Get()
    getLabResults() {
        return this.labResultsService.getAllLabResults();
    }
    @Get(':id')
    findAllLabResultsByPatient(
        @Param('id') patientId: number,
        @Query('page') page: number,
        @Query('sortBy') sortBy: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC',) {
        return this.labResultsService.getAllLabResultsByPatient(patientId, page, sortBy, sortOrder);
    }
    @Patch('update/:id')
    updateLabResults(@Param('id') id: number, @Body() updateLabResultInput: UpdateLabResultInput) {
        return this.labResultsService.updateLabResults(id, updateLabResultInput);
    }
    @Patch('delete/:id')
    softDeletePrescriptions(@Param('id') id: number) {
        return this.labResultsService.softDeleteLabResults(id);
    }
}
