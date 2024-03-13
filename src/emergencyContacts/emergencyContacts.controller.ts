import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Field, Int } from '@nestjs/graphql';
import { CreateEmergencyContactsInput } from './dto/create-emergencyContacts.input';
import { EmergencyContactsService } from './emergencyContacts.service';
import { UpdateEmergencyContactsInput } from './dto/update-emergencyContacts.input';

@Controller('emergency-contacts')
export class EmergencyContactsController {
    constructor(private readonly emergencyContactService: EmergencyContactsService) { }

    @Post()
    createEmergencyContacts(@Body() createEmergencyContactsInput: CreateEmergencyContactsInput) {
        return this.emergencyContactService.createEmergencyContacts(createEmergencyContactsInput);
    }

    @Post('getAll')
    getEmergencyContacts() {
        return this.emergencyContactService.getAllEmergencyContacts();
    }

    @Post(':id')
    findAllEmergencyContactsByPatient(
        @Param('id') patientId: number,
        @Query('page') page: number,
        @Query('sortBy') sortBy: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC',) {
        return this.emergencyContactService.getAllEmergencyContactsByPatient(patientId, page, sortBy, sortOrder);
    }
    @Patch('update/:id')
    updateEmergencyContacts(@Param('id') id: number, @Body() updateEmergencyContactsInput: UpdateEmergencyContactsInput) {
        return this.emergencyContactService.updateEmergencyContacts(id, updateEmergencyContactsInput);
    }
    @Patch('delete/:id')
    softDeleteEmergencyContacts(@Param('id') id: number) {
        return this.emergencyContactService.softDeleteEmergencyContacts(id);
    }


}