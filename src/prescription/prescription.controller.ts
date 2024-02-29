import { CreatePrescriptionInput } from './dto/create-prescription.input';
import { PrescriptionService } from './prescription.service';
import { Controller, Get, Param, Post, Body, Query, Patch } from '@nestjs/common';

@Controller('prescription')
export class PrescriptionController {

    constructor(private readonly prescriptionService: PrescriptionService) { }

    @Post()
    createPrescription(@Body() createPrescriptionInput: CreatePrescriptionInput) {
        return this.prescriptionService.createPrescription(createPrescriptionInput);
    }
    @Get(':id')
    findAllPrescriptions(
        @Param('id') id: number,
        @Query('page') page: number,
        @Query('sortBy') sortBy: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC',) {
        return this.prescriptionService.getPrescriptionById(id, page, sortBy, sortOrder);
    }
    // @Get('list')
    // findAllPatientsBasicInfo(
    //     @Query('page') page: number,
    //     @Query('sortBy') sortBy: string,
    //     @Query('sortOrder') sortOrder: 'ASC' | 'DESC',
    // ) {
    //     return this.prescriptionService.getAllPatientsBasicInfo(page, sortBy, sortOrder);
    // }
}
