import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
    @Post('getAll')
    getLabResults() {
        return this.labResultsService.getAllLabResults();
    }
    @Post(':id')
    findAllLabResultsByPatient(
        @Param('id') patientId: string,
        @Body() body: { page: number, sortBy: string , sortOrder: 'ASC' | 'DESC' }
    ) {
      const { page, sortBy, sortOrder } = body;
        return this.labResultsService.getAllLabResultsByPatient(patientId, page, sortBy, sortOrder);
    }
    @Patch('update/:id')
    updateLabResults(@Param('id') id: string, @Body() updateLabResultInput: UpdateLabResultInput) {
        return this.labResultsService.updateLabResults(id, updateLabResultInput);
    }
    @Patch('delete/:id')
    softDeletePrescriptions(@Param('id') id: string) {
        return this.labResultsService.softDeleteLabResults(id);
    }

}