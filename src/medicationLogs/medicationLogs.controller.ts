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
        @Body() body: { page: number, sortBy: string , sortOrder: 'ASC' | 'DESC' }
    ) {
      const { page, sortBy, sortOrder } = body;
        return this.medicationLogsService.getAllASCHMedicationLogsByPatient(patientId, page, sortBy, sortOrder);
    }

    @Post(':id/prn')
    findAllPatientPRNMedicationLogs(
        @Param('id') patientId: string,
        @Body() body: { page: number, sortBy: string , sortOrder: 'ASC' | 'DESC' }
    ) {
      const { page, sortBy, sortOrder } = body;
        return this.medicationLogsService.getAllPRNMedicationLogsByPatient(patientId, page, sortBy, sortOrder);
    }

    //can delete both asch and prn
    //onClick from med- get medID for patch
    @Patch('update/:id')
    updateMedicationLogsInput(@Param('id') id: string, @Body() updateMedicationLogsInput: UpdateMedicationLogsInput) {
        return this.medicationLogsService.updateMedicationLogs(id, updateMedicationLogsInput);
    }

    @Patch('delete/:id')
    softDeleteMedicationLogs(@Param('id') id: string) {
        return this.medicationLogsService.softDeleteMedicationLogs(id);
    }
}
