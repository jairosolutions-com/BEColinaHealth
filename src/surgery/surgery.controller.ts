import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SurgeryService } from './surgery.service';
import { CreateSurgeryDto } from './dto/create-surgery.dto';
import { UpdateSurgeryDto } from './dto/update-surgery.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('surgery')
@UseGuards(AuthGuard)
export class SurgeryController {
  constructor(private readonly surgeryService: SurgeryService) {}

  @Post()
  async createSurgery(@Body() createSurgeryDto: CreateSurgeryDto) {
    try {
      const surgery = await this.surgeryService.createSurgery(createSurgeryDto);
      return surgery;
    } catch (error) {
      if (
        error.message === 'Patient not found' ||
        error.message ===
          'A Surgery with the same type of Surgery already exists'
      ) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Failed to create patient allergy',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
