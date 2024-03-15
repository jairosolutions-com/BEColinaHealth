import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { VitalSignsService } from './vitalSigns.service';
import { CreateVitalSignInput } from './dto/create-vitalSigns.input';
import { UpdateVitalSignInput } from './dto/update-vitalSigns.input';

@Controller('vital-signs')
export class VitalSignsController {
    constructor(private readonly vitalSignService: VitalSignsService) { }

    @Post()
    createVitalSign(@Body() createVitalSignInput: CreateVitalSignInput) {
        return this.vitalSignService.createVitalSign(createVitalSignInput);
    }
    @Post('getAll')
    getAllVitalSigns() {
        return this.vitalSignService.getAllVitalSign();
    }
    @Post(':id')
    findAllPatientVitalSigns(
        @Param('id') patientId: string,
        @Body() body: { page: number, sortBy: string , sortOrder: 'ASC' | 'DESC' }
    ) {
      const { page, sortBy, sortOrder } = body;
        return this.vitalSignService.getAllVitalSignsByPatient(patientId, page, sortBy, sortOrder);
    }
    //onClick from prescriptions- get prescriptionsId for patch
    @Patch('update/:id')
    updateVitalSign(@Param('id') id: string, @Body() updateVitalSignInput: UpdateVitalSignInput) {
        return this.vitalSignService.updateVitalSign(id, updateVitalSignInput);
    }

    @Patch('delete/:id')
    softDeleteVitalSign(@Param('id') id: string) {
        return this.vitalSignService.softDeleteVitalSign(id);
    }
}
