import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { CreateAllergiesInput } from './dto/create-allergies.dto';
import { UpdateAllergiesInput } from './dto/update-allergies.dto';

@Controller('allergies')
export class AllergiesController {
    constructor(private readonly allergiesService: AllergiesService) { }


    @Post()
    createAllergies(@Body() createAllergiesInput: CreateAllergiesInput) {
        return this.allergiesService.createAllergies(createAllergiesInput);
    }
    @Post('getAll')
    getAllAllergies() {
        return this.allergiesService.getAllAllergies();
    }
    @Post(':id')
    findAllPatientAllergies(
        @Param('id') patientId: string,
        @Query('page') page: number,
        @Query('sortBy') sortBy: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC',) {
        return this.allergiesService.getAllAllergiesByPatient(patientId, page, sortBy, sortOrder);
    }
    //onClick from prescriptions- get prescriptionsId for patch
    @Patch('update/:id')
    updateAllergies(@Param('id') id: number, @Body() updateAllergiesInput: UpdateAllergiesInput) {
        return this.allergiesService.updateAllergies(id, updateAllergiesInput);
    }

    @Patch('delete/:id')
    softDeleteAllergies(@Param('id') id: number) {
        return this.allergiesService.softDeleteAllergies(id);
    }
}