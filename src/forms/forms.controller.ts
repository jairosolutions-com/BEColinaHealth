import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post(':id')
  createForm(@Param('id') patientId: string, @Body() createFormDto: CreateFormDto) {
    return this.formsService.createForm(patientId, createFormDto);
  }

  @Post('list/:id')
  findAllPatientForms(
    @Param('id') patientId: string,
    @Body() body: { term: string; page: number; sortBy: string; sortOrder: 'ASC' | 'DESC' },
  ) {
    const { term = '', page, sortBy, sortOrder } = body;
    return this.formsService.getAllFormsByPatient(patientId, term, page, sortBy, sortOrder);
  }

  @Patch('update/:id')
  updateForm(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formsService.updateForm(id, updateFormDto);
  }

  @Patch('delete/:id')
  softDeleteForm(@Param('id') id: string) {
    return this.formsService.softDeleteForm(id);
  }
}
