import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LabResultsService } from './lab_results.service';
import { CreateLabResultInput } from './dto/create-lab_result.input';
import { UpdateLabResultInput } from './dto/update-lab_result.input';

@Controller('lab-results')
export class LabResultsController {
    constructor(private readonly labResultService: LabResultsService) { }
    @Post()
    createLabResult(@Body() createLabResultInput: CreateLabResultInput) {
        return this.labResultService.createLabResults(createLabResultInput);
    }
    @Get()
    getLabResults() {
        return this.labResultService.getAllLabResults();
    }
    @Get(':id')
    findAllLabResultsByPatient(
        @Param('id') patientId: number,
        @Query('page') page: number,
        @Query('sortBy') sortBy: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC',) {
        return this.labResultService.getAllLabResultsByPatient(patientId, page, sortBy, sortOrder);
    }
    @Patch('update/:id')
    updateLabResults(@Param('id') id: number, @Body() updateLabResultInput: UpdateLabResultInput) {
        return this.labResultService.updateLabResults(id, updateLabResultInput);
    }
    @Patch('delete/:id')
    softDeletePrescription(@Param('id') id: number) {
        return this.labResultService.softDeleteLabResults(id);
    }
}
