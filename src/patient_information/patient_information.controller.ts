import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { PatientInformationService } from './patient_information.service';
import { CreatePatientInformationInput } from './dto/create-patient_information.input';

@Controller('patient-information')
export class PatientInformationController {
    constructor(private readonly patientInformationService: PatientInformationService) { }
    @Get()
    findAllPatientsAllInfo() {
        return this.patientInformationService.getAllPatientsFullInfo();
    }
    //get patient list page basic info (id, name, age, gender)
    //values per page is set as perPage, page is page number 

    //when filtering if show 1or 2 items per page check the service for getList

    @Get('list')
    findAllPatientsBasicInfo(
        @Query('page') page: number = 1,
    ) {
        return this.patientInformationService.getAllPatientsBasicInfo(page);
    }
    //search for term and filter it then use paging
    @Get('search')
    getPatientInformationByName(
        @Query('term') term: string,
        @Query('page') page: number = 1,
    ) {
        return this.patientInformationService.searchAllPatientInfoByTerm(term, page);
    }

    // POST /nachos
    @Post()
    createPatient(@Body() createPatientInformationInput: CreatePatientInformationInput) {
        return this.patientInformationService.createPatientInformation(createPatientInformationInput);
    }
}


