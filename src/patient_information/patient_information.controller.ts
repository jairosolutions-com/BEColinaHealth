import { Controller, Get, Param, Post, Body, Query, Patch } from '@nestjs/common';
import { PatientInformationService } from './patient_information.service';
import { CreatePatientInformationInput } from './dto/create-patient_information.input';
import { UpdatePatientInformationInput } from './dto/update-patient_information.input';

@Controller('patient-information')
export class PatientInformationController {
    constructor(private readonly patientInformationService: PatientInformationService) { }
    // @Get()
    // findAllPatientsAllInfo() {
    //     return this.patientInformationService.getAllPatientsFullInfo();
    // }


    //values per page is set as perPage, page is page number 
    //when limiting number of items per page, check the service for getList
    //get patient list page basic info (id, name, age, gender)
    @Get('list')
    findAllPatientsBasicInfo(
        @Query('page') page: number,
        @Query('sortBy') sortBy: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC',
    ) {
        return this.patientInformationService.getAllPatientsBasicInfo(page, sortBy, sortOrder);
    }
    //search for term and filter it then use paging
    @Get('search')
    getPatientInformationByName(
        @Query('term') term: string,
        @Query('page') page: number = 1,
    ) {
        return this.patientInformationService.searchAllPatientInfoByTerm(term, page);
    }
    @Get('overview/:id')
    getPatientOverviewById(@Param('id') id: number) {
        return this.patientInformationService.getPatientOverviewById(id);
    }

    // POST /patient-information
    @Post()
    createPatient(@Body() createPatientInformationInput: CreatePatientInformationInput) {
        return this.patientInformationService.createPatientInformation(createPatientInformationInput);
    }
    // PATCH /patient-information/{id}
    @Patch('update/:id')
    updatePatientInfo(@Param('id') id: number, @Body() updatePatientInformationInput: UpdatePatientInformationInput) {
        return this.patientInformationService.updatePatientInformation(id, updatePatientInformationInput);
    }

    @Patch('delete/:id')
    softDeletePatient(@Param('id') id: number) {
        return this.patientInformationService.softDeletePatient(id);
    }
}


