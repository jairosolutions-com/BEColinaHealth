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
import { Surgeries } from './entities/surgeries.entity';

@Controller('surgeries')
@UseGuards(AuthGuard)
export class SurgeriesController {
  constructor(private readonly surgeriesService: SurgeriesService) {}

  @Post()
  async createSurgeries(@Body() createSurgeriesDto: CreateSurgeriesDto):Promise<Surgeries> {
    try {
      const surgeries =
        await this.surgeriesService.createAllergies(createSurgeriesDto);
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
          'Failed to create patient allergies',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post(':id')
  findAllPatientSurgeries(
    @Param('id') patientId: string,
    @Body() body: { page: number; sortBy: string; sortOrder: 'ASC' | 'DESC' },
  ): Promise<{
    data: Surgeries[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const { page, sortBy, sortOrder } = body;
    return this.surgeriesService.getAllSurgeriesByPatient(
      patientId,
      page,
      sortBy,
      sortOrder,
    );
  }
}
