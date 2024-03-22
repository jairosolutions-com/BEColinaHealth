
import { Controller, Get, Param, Post, Body, Query, Patch } from '@nestjs/common';
import { CreatePrescriptionsInput } from './dto/create-prescriptions.input';
import { UpdatePrescriptionsInput } from './dto/update-prescriptions.input';
import { PrescriptionsService } from './prescriptions.service';

@Controller('prescriptions')
export class PrescriptionsController {

    constructor(private readonly prescriptionsService: PrescriptionsService) { }

    @Post(':id')
    createPrescriptions(
        @Param('id') patientId: string,
        @Body() createPrescriptionsInput: CreatePrescriptionsInput) {
        return this.prescriptionsService.createPrescriptions(patientId,createPrescriptionsInput);
    }
    @Post('getAll')
    getAllPrescriptions() {
        return this.prescriptionsService.getAllPrescriptions();
    }
    @Post('list/:id')
    findAllPatientPrescriptions(
        @Param('id') patientId: string,
        @Body() body: { term: string, page: number, sortBy: string, sortOrder: 'ASC' | 'DESC' }
    ) {
        const { term = "", page, sortBy, sortOrder } = body;
        return this.prescriptionsService.getAllPrescriptionsByPatient(patientId, term, page, sortBy, sortOrder);
    }
    //onClick from prescriptions- get prescriptionsId for patch
    @Patch('update/:id')
    updatePrescriptions(@Param('id') id: string, @Body() updatePrescriptionsInput: UpdatePrescriptionsInput) {
        return this.prescriptionsService.updatePrescriptions(id, updatePrescriptionsInput);
    }

    @Patch('delete/:id')
    softDeletePrescriptions(@Param('id') id: string) {
        return this.prescriptionsService.softDeletePrescriptions(id);
    }
}
