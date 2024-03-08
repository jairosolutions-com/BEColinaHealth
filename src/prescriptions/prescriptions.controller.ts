
import { Controller, Get, Param, Post, Body, Query, Patch } from '@nestjs/common';
import { CreatePrescriptionsInput } from './dto/create-prescriptions.input';
import { UpdatePrescriptionsInput } from './dto/update-prescriptions.input';
import { PrescriptionsService } from './prescriptions.service';

@Controller('prescriptions')
export class PrescriptionsController {

    constructor(private readonly prescriptionsService: PrescriptionsService) { }

    @Post()
    createPrescriptions(@Body() createPrescriptionsInput: CreatePrescriptionsInput) {
        return this.prescriptionsService.createPrescriptions(createPrescriptionsInput);
    }
    @Get()
    getAllPrescriptions() {
        return this.prescriptionsService.getAllPrescriptions();
    }
    @Get(':id')
    findAllPatientPrescriptions(
        @Param('id') patientId: number,
        @Query('page') page: number,
        @Query('sortBy') sortBy: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC',) {
        return this.prescriptionsService.getAllPrescriptionsByPatient(patientId, page, sortBy, sortOrder);
    }
    //onClick from prescriptions- get prescriptionsId for patch
    @Patch('update/:id')
    updatePrescriptions(@Param('id') id: number, @Body() updatePrescriptionsInput: UpdatePrescriptionsInput) {
        return this.prescriptionsService.updatePrescriptions(id, updatePrescriptionsInput);
    }

    @Patch('delete/:id')
    softDeletePrescriptions(@Param('id') id: number) {
        return this.prescriptionsService.softDeletePrescriptions(id);
    }
}
