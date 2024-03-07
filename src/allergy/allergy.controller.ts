import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AllergyService } from './allergy.service';
import { CreateAllergyInput } from './dto/create-allergy.dto';
import { UpdateAllergyInput } from './dto/update-allergy.dto';

@Controller('allergy')
export class AllergyController {
  constructor(private readonly allergyService: AllergyService) {}


  @Post()
  createAllergy(@Body() createAllergyInput: CreateAllergyInput) {
      return this.allergyService.createAllergy(createAllergyInput);
  }
  @Get()
  getAllAllergy() {
      return this.allergyService.getAllAllergy();
  }
  @Get(':id')
  findAllPatientVitalSigns(
      @Param('id') patientId: number,
      @Query('page') page: number,
      @Query('sortBy') sortBy: string,
      @Query('sortOrder') sortOrder: 'ASC' | 'DESC',) {
      return this.allergyService.getAllAllergyByPatient(patientId, page, sortBy, sortOrder);
  }
  //onClick from prescription- get prescriptionId for patch
  @Patch('update/:id')
  updateAllergy(@Param('id') id: number, @Body() updateAllergyInput: UpdateAllergyInput) {
      return this.allergyService.updateAllergy(id, updateAllergyInput);
  }

  @Patch('delete/:id')
  softDeleteAllergy(@Param('id') id: number) {
      return this.allergyService.softDeleteAllergy(id);
  }
}