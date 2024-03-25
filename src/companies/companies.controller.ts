import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Companies } from './entities/companies.entity';
import { CompaniesService } from './companies.service';
import { CreateCompaniesInput } from './dto/create-companies.input';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateCompaniesInput } from './dto/update-companies.input';

@Controller('companies')
@UseGuards(AuthGuard)
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) { }

  @Post('search')
  async searchCompanies(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ companies: Companies[]; total: number }> {
    return this.companyService.searchCompanies(keyword, page, limit);
  }

  @Post('get/all')
  async getAllCompanies(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ companies: Companies[]; total: number }> {
    return this.companyService.getAllCompanies(page, limit);
  }

  @Post()
  async createCompanies(
    @Body() createCompaniesInput: CreateCompaniesInput,
  ): Promise<any> {
    try {
      return await this.companyService.createCompanies(createCompaniesInput);
    } catch (error) {
      throw error;
    }
  }

  @Patch('update/:id')
  async updateCompanies(
    @Param('id') id: string,
    @Body() updateCompaniesInput: UpdateCompaniesInput,
  ): Promise<Companies> {
    const updatedCompanies = await this.companyService.updateCompanies(
      id,
      updateCompaniesInput,
    );

    if (!updatedCompanies) {
      throw new NotFoundException(`Companies with ID ${id} not found`);
    }
    return updatedCompanies;
  }

  @Patch('delete/:id')
  async softDeleteCompanies(@Param('id') id: number): Promise<Companies> {
    const updatedCompanies = await this.companyService.softDeleteCompanies(id);

    if (!updatedCompanies) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedCompanies;
  }
}
