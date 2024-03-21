import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { CreateAllergiesInput } from './dto/create-allergies.dto';
import { UpdateAllergiesInput } from './dto/update-allergies.dto';
import { Allergies } from './entities/allergies.entity';

@Controller('allergies')
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}

  @Post()
  createAllergies(
    @Body() createAllergiesInput: CreateAllergiesInput,
  ): Promise<Allergies> {
    return this.allergiesService.createAllergies(createAllergiesInput);
  }
  //onClick from prescriptions- get prescriptionsId for patch

  @Post(':id')
  findAllPatientAllergies(
    @Param('id') patientId: string,
    @Body() body: { page: number; sortBy: string; sortOrder: 'ASC' | 'DESC' },
  ): Promise<{
    data: Allergies[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const { page, sortBy, sortOrder } = body;
    return this.allergiesService.getAllAllergiesByPatient(
      patientId,
      page,
      sortBy,
      sortOrder,
    );
  }

  @Post('search/:id')
  searchAllPatientAllergiesByTerm(
    @Param('id') patientId: string,
    @Body()
    requestData: {
      term: string;
      page: number;
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
    },
  ): Promise<{
    data: Allergies[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const { term, page, sortBy, sortOrder } = requestData;
    return this.allergiesService.searchPatientAllergiesByTerm(
      patientId,
      term,
      page,
      sortBy,
      sortOrder,
    );
  }

  // @Post(':id')
  // findAllPatientAllergies(
  //     @Param('id') patientId: string,
  //     @Query('page') page: number,
  //     @Query('sortBy') sortBy: string,
  //     @Query('sortOrder') sortOrder: 'ASC' | 'DESC',) {
  //     return this.allergiesService.getAllAllergiesByPatient(patientId, page, sortBy, sortOrder);
  // }
  //onClick from prescriptions- get prescriptionsId for patch
  @Patch('update/:id')
  updateAllergies(
    @Param('id') id: string,
    @Body() updateAllergiesInput: UpdateAllergiesInput,
  ) {
    return this.allergiesService.updateAllergies(id, updateAllergiesInput);
  }

  @Patch('delete/:id')
  softDeleteAllergies(@Param('id') id: string) {
    return this.allergiesService.softDeleteAllergies(id);
  }
}
