import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { CreatePatientsInput } from './dto/create-patients.input';
import { UpdatePatientsInput } from './dto/update-patients.input';
import { PatientsService } from './patients.service';
import { Patients } from './entities/patients.entity';

@Controller('patient-information')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post('getAll')
  findAllPatientsAllInfo() {
    return this.patientsService.getAllPatientsFullInfo();
  }

  @Post('list')
  async findAllPatientsBasicInfo(
    @Body()
    requestData: {
      page: number;
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
    },
  ): Promise<{
    data: Patients[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const { page, sortBy, sortOrder } = requestData;
    return this.patientsService.getAllPatientsBasicInfo(
      page,
      sortBy,
      sortOrder,
    );
  }

  @Post('search')
  getPatientsByName(
    @Body()
    requestData: {
      term: string;
      page: number;
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
    },
  ): Promise<{
    data: Patients[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const { term, page, sortBy, sortOrder } = requestData;
    return this.patientsService.searchAllPatientInfoByTerm(
      term,
      page,
      sortBy,
      sortOrder,
    );
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
  updatePatientInfo(
    @Param('id') id: string,
    @Body() updatePatientsInput: UpdatePatientsInput,
  ) {
    return this.patientsService.updatePatients(id, updatePatientsInput);
  }

  @Patch('delete/:id')
  softDeletePatient(@Param('id') id: string) {
    return this.patientsService.softDeletePatient(id);
  }
}
