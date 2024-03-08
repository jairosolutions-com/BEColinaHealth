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
import { SurgeriesService } from './surgeries.service';
import { CreateSurgeriesDto } from './dto/create-surgeries.dto';
import { UpdateSurgeriesDto } from './dto/update-surgeries.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('surgeries')
@UseGuards(AuthGuard)
export class SurgeriesController {
  constructor(private readonly surgeriesService: SurgeriesService) { }

  @Post()
  async createSurgeries(@Body() createSurgeriesDto: CreateSurgeriesDto) {
    try {
      const surgeries = await this.surgeriesService.createSurgeries(createSurgeriesDto);
      return surgeries;
    } catch (error) {
      if (
        error.message === 'Patient not found' ||
        error.message ===
        'A Surgeries with the same type of Surgeries already exists'
      ) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Failed to create patient allergies',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
