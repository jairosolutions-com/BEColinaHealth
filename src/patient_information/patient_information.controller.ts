import { Controller, Get, Param, Post,Body } from '@nestjs/common';
import { PatientInformationService } from './patient_information.service';
import { CreatePatientInformationInput } from './dto/create-patient_information.input';

@Controller('patient-information')
export class PatientInformationController {
    constructor(private readonly patientInformationService: PatientInformationService) { }
    @Get()
    findAllPatients() {
        return this.patientInformationService.getAllPatients();
    }
    // patient-information/{id}
    @Get(':id')
    findPatientById(@Param('id') id: string) {
        return this.patientInformationService.getPatientInformationById(+id);
    };

    // POST /nachos
    @Post()
    createNacho(@Body() createPatientInformationInput: CreatePatientInformationInput) {
        return this.patientInformationService.createPatientInformation(createPatientInformationInput);
    }
}


