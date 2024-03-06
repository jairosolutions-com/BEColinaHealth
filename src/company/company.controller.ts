import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyService } from './company.service';
import { CreateCompanyInput } from './dto/create-company.input';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('company')
@UseGuards(AuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('search')
  async searchCompany(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ company: Company[]; total: number }> {
    return this.companyService.searchCompany(keyword, page, limit);
  }

  @Get()
  async getAllCompany(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ company: Company[]; total: number }> {
    return this.companyService.getAllCompany(page, limit);
  }

  @Post()
  async createCompany(
    @Body() createCompanyInput: CreateCompanyInput,
  ): Promise<any> {
    try {
      return await this.companyService.createCompany(createCompanyInput);
    } catch (error) {
      throw error;
    }
  }
}
