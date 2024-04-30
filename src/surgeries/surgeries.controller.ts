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
  @Post(':id')
  async createSurgeries(
    @Param('id') patientId: string,
    @Body() createSurgeriesDto: CreateSurgeriesDto,
  ) {
    try {
      const surgeries = await this.surgeriesService.createSurgeries(
        patientId,
        createSurgeriesDto,
      );

      return surgeries;
    } catch (error) {
      if (
        error.message === 'Patient not found' ||
        error.message === 'Surgery with the same type already exists.'
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
  @Post('list/:id')
  findAllSurgeriesByPatient(
    @Param('id') patientId: string,
    @Body()
    body: {
      term: string;
      page: number;
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
    },
  ) {
    const { term = '', page, sortBy, sortOrder } = body;
    return this.surgeriesService.getAllSurgeryByPatient(
      patientId,
      term,
      page,
      sortBy,
      sortOrder,
    );
  }
  @Patch('update/:id')
  updateSurgery(
    @Param('id') id: string,
    @Body() updateSurgeriesDto: UpdateSurgeriesDto,
  ) {
    return this.surgeriesService.updateSurgery(id, updateSurgeriesDto);
  }
  @Patch('delete/:id')
  softDeleteSurgeries(@Param('id') id: string) {
    return this.surgeriesService.softDeleteSurgery(id);
  }
}
