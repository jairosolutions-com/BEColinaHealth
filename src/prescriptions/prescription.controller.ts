import { CreatePrescriptionInput } from './dto/create-prescription.input';
import { UpdatePrescriptionInput } from './dto/update-prescription.input';
import { PrescriptionService } from './prescription.service';
import { Controller, Get, Param, Post, Body, Query, Patch } from '@nestjs/common';

@Controller('prescription')
export class PrescriptionController {

    constructor(private readonly prescriptionService: PrescriptionService) { }

    @Post()
    createPrescription(@Body() createPrescriptionInput: CreatePrescriptionInput) {
        return this.prescriptionService.createPrescription(createPrescriptionInput);
    }
    @Get()
    getAllPrescription() {
        return this.prescriptionService.getAllPrescriptions();
    }
    @Get(':id')
    findAllPatientPrescriptions(
        @Param('id') patientId: number,
        @Query('page') page: number,
        @Query('sortBy') sortBy: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC',) {
        return this.prescriptionService.getAllPrescriptionsByPatient(patientId, page, sortBy, sortOrder);
    }
    //onClick from prescription- get prescriptionId for patch
    @Patch('update/:id')
    updatePrescription(@Param('id') id: number, @Body() updatePrescriptionInput: UpdatePrescriptionInput) {
        return this.prescriptionService.updatePrescription(id, updatePrescriptionInput);
    }

    @Patch('delete/:id')
    softDeletePrescription(@Param('id') id: number) {
        return this.prescriptionService.softDeletePrescription(id);
    }
}
