import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { CreateMedicationInput } from './dto/create-medication.input';
import { UpdateMedicationInput } from './dto/update-medication.input';

@Controller('medication')
export class MedicationController {
    constructor(private readonly medicationService: MedicationService) { }

    @Post()
    createMedication(@Body() createMedicationInput: CreateMedicationInput) {
        return this.medicationService.createMedication(createMedicationInput);
    }
    @Get()
    getAllMedication() {
        return this.medicationService.getAllMedication();
    }
    @Get(':id')
    findAllPatientMedication(
        @Param('id') patientId: number,
        @Query('page') page: number,
        @Query('sortBy') sortBy: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC',) {
        return this.medicationService.getAllMedicationsByPatient(patientId, page, sortBy, sortOrder);
    }
    //onClick from prescription- get prescriptionId for patch
    @Patch('update/:id')
    updateMedicationInput(@Param('id') id: number, @Body() updateMedicationInput: UpdateMedicationInput) {
        return this.medicationService.updateMedication(id, updateMedicationInput);
    }

    @Patch('delete/:id')
    softDeleteMedication(@Param('id') id: number) {
        return this.medicationService.softDeleteMedication(id);
    }
}
