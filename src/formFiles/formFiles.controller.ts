import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { FormFilesService } from './formFiles.service';
import { CreateFormFileDto } from './dto/create-formFile.dto';
import { UpdateFormFileDto } from './dto/update-formFile.dto';

@Controller('formFiles')
export class FormFilesController {
  // constructor(private readonly formFilesService: FormFilesService) { }

  // @Post()
  // create(@Body() createFormFileDto: CreateFormFileDto) {
  //   return this.formFilesService.create(createFormFileDto);
  // }

  // @Get()
  // findAll() {
  //   return this.formFilesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.formFilesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFormFileDto: UpdateFormFileDto) {
  //   return this.formFilesService.update(+id, updateFormFileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.formFilesService.remove(+id);
  // }
}
