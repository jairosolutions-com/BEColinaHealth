import { Controller, Get, Param, Post, Body, Query, Patch } from '@nestjs/common';
import { CreatePatientsInput } from './dto/create-patients.input';
import { UpdatePatientsInput } from './dto/update-patients.input';
import { PatientsService } from './patients.service';

@Controller('patient-information')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) { }
    @Post('getAll')
    findAllPatientsAllInfo() {
        return this.patientsService.getAllPatientsFullInfo();
    }


    //values per page is set as perPage, page is page number 
    //when limiting number of items per page, check the service for getList
    //get patient list page basic info (id, name, age, gender)
    @Post('list')
    findAllPatientsBasicInfo(
        @Query('page') page: number,
        @Query('sortBy') sortBy: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC',
    ) {
        return this.patientsService.getAllPatientsBasicInfo(page, sortBy, sortOrder);
    }
    //search for term and filter it then use paging
    @Post('search')
    getPatientsByName(
        @Query('term') term: string,
        @Query('page') page: number = 1,
    ) {
        return this.patientsService.searchAllPatientInfoByTerm(term, page);
    }
    @Get('overview/:id')
    getPatientOverviewById(@Param('id') id: string) {
        return this.patientsService.getPatientOverviewById(id);
    }
    @Get('fullInfo/:id')
    getPatientFullInfoById(@Param('id') id: string) {
        return this.patientsService.getPatientFullInfoById(id);
    }
    // POST /patient-information
    @Post()
    createPatient(@Body() createPatientsInput: CreatePatientsInput) {
        return this.patientsService.createPatients(createPatientsInput);
    }
    // PATCH /patient-information/{id}
    @Patch('update/:id')
    updatePatientInfo(@Param('id') id: string, @Body() updatePatientsInput: UpdatePatientsInput) {
        return this.patientsService.updatePatients(id, updatePatientsInput);
    }

    @Patch('delete/:id')
    softDeletePatient(@Param('id') id: number) {
        return this.patientsService.softDeletePatient(id);
    }
}


