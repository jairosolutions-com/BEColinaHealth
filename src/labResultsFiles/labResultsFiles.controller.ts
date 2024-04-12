import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { LabResultsFilesService } from './labResultsFiles.service';
import { CreateLabResultsFileDto } from './dto/create-labResultsFiles.dto';
import { UpdateLabResultsFileDto } from './dto/update-labResultsFiles.dto';
import { Readable } from 'stream';
import { Response } from 'express';
import { extname } from 'path'; // Import the 'extname' function from the 'path' module



@Controller('labResultsFiles')
export class LabResultsFilesController {
  constructor(private readonly labResultsFilesService: LabResultsFilesService) { }

  // @Get(':id')
  // async getDatabaseFileById(@Param('id', ParseIntPipe) @Param('file_uuid') file_uuid: string, id: string, @Res({ passthrough: true }) response: Response) {
  //   const file = await this.labResultsFilesService.getFileByLabUuid(id, file_uuid);
  //   const stream = Readable.from(file.data);
  //   let contentType;

  //   const ext = extname(file.filename).toLowerCase();
  //   switch (ext) {
  //     case '.jpeg':
  //     case '.jpg':
  //       contentType = 'image/jpeg';
  //       break;
  //     case '.png':
  //       contentType = 'image/png';
  //       break;
  //     case '.pdf':
  //       contentType = 'application/pdf';
  //       break;
  //     // Add more cases as needed for additional file types
  //     default:
  //       // If the file type is not recognized, set a default content type
  //       contentType = 'application/octet-stream'; // Default binary content type
  //   }

  //   // Set the appropriate 'Content-Type' header
  //   response.set({
  //     'Content-Disposition': `inline; filename="${file.filename}"`,
  //     'Content-Type': contentType
  //   });
  //   return new StreamableFile(stream);
  // }
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
