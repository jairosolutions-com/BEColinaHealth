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
  ConflictException,
} from '@nestjs/common';
import { SurgeriesService } from './surgeries.service';
import { CreateSurgeriesDto } from './dto/create-surgeries.dto';
import { UpdateSurgeriesDto } from './dto/update-surgeries.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('surgeries')
@UseGuards(AuthGuard)
export class SurgeriesController {
  constructor(private readonly surgeriesService: SurgeriesService) { }

  @Post(':id')
  async createSurgeries(@Param('id') patientId: string,
    @Body() createSurgeriesDto: CreateSurgeriesDto) {
    try {
      const surgeries =
        await this.surgeriesService.createSurgeries(patientId, createSurgeriesDto);
      return surgeries;
    } catch (error) {
      if (
        error.message === 'Patient not found' ||
        error.message ===
        'A Surgeries with the same type of Surgeries already exists'
      ) {
        throw new ConflictException(error.message);
      } else {
        throw new HttpException(
          'Failed to create patient surgeries',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
