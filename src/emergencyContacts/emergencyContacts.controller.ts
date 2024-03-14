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
        @Param('id') patientId: string,
        @Body() body: { page: number, sortBy: string , sortOrder: 'ASC' | 'DESC' }
    ) {
      const { page, sortBy, sortOrder } = body;
        return this.emergencyContactService.getAllEmergencyContactsByPatient(patientId, page, sortBy, sortOrder);
    }
    @Patch('update/:id')
    updateEmergencyContacts(@Param('id') id: string, @Body() updateEmergencyContactsInput: UpdateEmergencyContactsInput) {
        return this.emergencyContactService.updateEmergencyContacts(id, updateEmergencyContactsInput);
    }
    @Patch('delete/:id')
    softDeleteEmergencyContacts(@Param('id') id: string) {
        return this.emergencyContactService.softDeleteEmergencyContacts(id);
    }


}