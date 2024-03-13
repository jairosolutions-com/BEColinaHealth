import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MedicationLogsService } from './medicationLogs.service';
import { CreateMedicationLogsInput } from './dto/create-medicationLogs.input';
import { UpdateMedicationLogsInput } from './dto/update-medicationLogs.input';

@Controller('medicationLogs')
export class MedicationLogsController {
    constructor(private readonly medicationLogsService: MedicationLogsService) { }

    @Post()
    createMedicationLogs(@Body() createMedicationLogsInput: CreateMedicationLogsInput) {
        return this.medicationLogsService.createMedicationLogs(createMedicationLogsInput);
    }
    @Post('getAll')
    getAllMedicationLogs() {
        return this.medicationLogsService.getAllMedicationLogs();
    }

    @Post(':id/asch')
    findAllPatientASSMedicationLogs(
        @Param('id') patientId: string,
        @Query('page') page: number,
        @Query('sortBy') sortBy: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC'
    ) {
        return this.medicationLogsService.getAllASCHMedicationLogsByPatient(patientId, page, sortBy, sortOrder);
    }

    @Post(':id/prn')
    findAllPatientPRNMedicationLogs(
        @Param('id') patientId: string,
        @Query('page') page: number,
        @Query('sortBy') sortBy: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC'
    ) {
        return this.medicationLogsService.getAllPRNMedicationLogsByPatient(patientId, page, sortBy, sortOrder);
    }

    //can delete both asch and prn
    //onClick from med- get medID for patch
    @Patch('update/:id')
    updateMedicationLogsInput(@Param('id') id: number, @Body() updateMedicationLogsInput: UpdateMedicationLogsInput) {
        return this.medicationLogsService.updateMedicationLogs(id, updateMedicationLogsInput);
    }

    @Patch('delete/:id')
    softDeleteMedicationLogs(@Param('id') id: number) {
        return this.medicationLogsService.softDeleteMedicationLogs(id);
    }
}
