import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MedicationService } from './medicationLog.service';
import { CreateMedicationInput } from './dto/create-medicationLog.input';
import { UpdateMedicationInput } from './dto/update-medicationLog.input';

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
    findAllPatientMedications(
        @Param('id') patientId: number,
        @Query('pagePrn') pagePrn: number, // Pagination for PRN medications
        @Query('pageAsch') pageAsch: number, // Pagination for ASCH medications
        @Query('sortByPrn') sortByPrn: string = 'medicationDate',
        @Query('sortOrderPrn') sortOrderPrn: 'ASC' | 'DESC' = 'ASC',
        @Query('sortByAsch') sortByAsch: string = 'medicationDate',
        @Query('sortOrderAsch') sortOrderAsch: 'ASC' | 'DESC' = 'ASC'
    ) {
        const prnMedications = this.medicationService.getAllPRNMedicationsByPatient(patientId, pagePrn, sortByPrn, sortOrderPrn);
        const aschMedications = this.medicationService.getAllASCHMedicationsByPatient(patientId, pageAsch, sortByAsch, sortOrderAsch);
        return { prnMedications, aschMedications };
    }

    //can delete both asch and prn
    //onClick from med- get medID for patch
    @Patch('update/:id')
    updateMedicationInput(@Param('id') id: number, @Body() updateMedicationInput: UpdateMedicationInput) {
        return this.medicationService.updateMedication(id, updateMedicationInput);
    }

    @Patch('delete/:id')
    softDeleteMedication(@Param('id') id: number) {
        return this.medicationService.softDeleteMedication(id);
    }
}
