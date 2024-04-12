import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LabResultsFilesService } from './labResultsFiles.service';
import { CreateLabResultsFileDto } from './dto/create-labResultsFiles.dto';
import { UpdateLabResultsFileDto } from './dto/update-labResultsFiles.dto';

@Controller('labResultsFiles')
export class LabResultsFilesController {
  constructor(private readonly labResultsFilesService: LabResultsFilesService) { }

  // @Post()
  // create(@Body() createLabResultsFileDto: CreateLabResultsFileDto) {
  //   return this.labResultsFilesService.create(createLabResultsFileDto);
  // }

  // @Get()
  // findAll() {
  //   return this.labResultsFilesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.labResultsFilesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLabResultsFileDto: UpdateLabResultsFileDto) {
  //   return this.labResultsFilesService.update(+id, updateLabResultsFileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.labResultsFilesService.remove(+id);
  // }
}
