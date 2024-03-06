import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { IdService } from 'services/uuid/id.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly idService: IdService,
  ) {}

  async getAllCompany(
    @Query('page') page: number = 1, // Default to page 1 if not provided
    @Query('limit') limit: number = 10, // Default limit to 10 if not provided
  ): Promise<{ company: Company[]; total: number }> {
    const [company, total] = await this.companyRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' },
    });
    return { company, total };
  }

  async searchCompany(
    keyword: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ company: Company[]; total: number }> {
    const options: FindManyOptions<Company> = {
      where: [{ uuid: ILike(`%${keyword}%`) }, { name: ILike(`%${keyword}%`) }],
      take: limit,
      skip: (page - 1) * limit,
    };

    const [company, total] = await this.companyRepository.findAndCount(options);

    return { company, total };
  }

  async createCompany(
    createCompanyInput: CreateCompanyInput,
  ): Promise<Company> {
    const existingCompany = await this.companyRepository.findOne({
      where: {
        name: ILike(`%${createCompanyInput.name}%`),
      },
    });
    if (existingCompany) {
      throw new HttpException('Company already exists', HttpStatus.CONFLICT);
    }

    try {
      const newCompany = new Company();
      newCompany.uuid = this.idService.generateRandomUUID('CID-');
      newCompany.name = createCompanyInput.name;
      newCompany.contactNo = createCompanyInput.contactNo;
      newCompany.website = createCompanyInput.website;
      newCompany.email = createCompanyInput.email;
      newCompany.country = createCompanyInput.country;
      newCompany.state = createCompanyInput.state;
      newCompany.zip = createCompanyInput.zip;

      const savedCompany = await this.companyRepository.save(newCompany);

      return savedCompany;
    } catch (error) {
      if (
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.CONFLICT
      ) {
        // Email already exists
        throw error;
      } else {
        // Other errors
        throw new HttpException(
          'Failed to create company',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
