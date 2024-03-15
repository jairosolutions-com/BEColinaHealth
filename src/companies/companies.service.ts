import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreateCompaniesInput } from './dto/create-companies.input';
import { UpdateCompaniesInput } from './dto/update-companies.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Companies } from './entities/companies.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { IdService } from 'services/uuid/id.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Companies)
    private readonly companyRepository: Repository<Companies>,
    private readonly idService: IdService,
  ) {}

  async getAllCompanies(
    @Query('page') page: number = 1, // Default to page 1 if not provided
    @Query('limit') limit: number = 10, // Default limit to 10 if not provided
  ): Promise<{ companies: Companies[]; total: number }> {
    const [companies, total] = await this.companyRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { name: 'ASC' },
    });
    return { companies, total };
  }

  async searchCompanies(
    keyword: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ companies: Companies[]; total: number }> {
    const options: FindManyOptions<Companies> = {
      where: [{ uuid: ILike(`%${keyword}%`) }, { name: ILike(`%${keyword}%`) }],
      take: limit,
      skip: (page - 1) * limit,
    };

    const [companies, total] =
      await this.companyRepository.findAndCount(options);

    return { companies, total };
  }

  async createCompanies(
    createCompaniesInput: CreateCompaniesInput,
  ): Promise<Companies> {
    const existingCompanies = await this.companyRepository.findOne({
      where: {
        name: ILike(`%${createCompaniesInput.name}%`),
      },
    });
    if (existingCompanies) {
      throw new HttpException('Companies already exists', HttpStatus.CONFLICT);
    }

    try {
      const newCompanies = new Companies();
      newCompanies.uuid = this.idService.generateRandomUUID('CID-');
      newCompanies.name = createCompaniesInput.name;
      newCompanies.contactNo = createCompaniesInput.contactNo;
      newCompanies.website = createCompaniesInput.website;
      newCompanies.email = createCompaniesInput.email;
      newCompanies.countries = createCompaniesInput.countries;
      newCompanies.state = createCompaniesInput.state;
      newCompanies.zip = createCompaniesInput.zip;

      const savedCompanies = await this.companyRepository.save(newCompanies);

      return savedCompanies;
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
          'Failed to create companies',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateCompanies(
    id: string,
    updateCompaniesInput: UpdateCompaniesInput,
  ): Promise<Companies> {
    const companies = await this.companyRepository.findOne({
      where: {
        uuid: id,

      },
    });
    if (!companies) {
      throw new Error(`Companies with id ${id} not found`);
    }

    if (updateCompaniesInput.contactNo !== undefined) {
      companies.contactNo = updateCompaniesInput.contactNo;
    }
    if (updateCompaniesInput.countries !== undefined) {
      companies.countries = updateCompaniesInput.countries;
    }
    if (updateCompaniesInput.email !== undefined) {
      companies.email = updateCompaniesInput.email;
    }
    if (updateCompaniesInput.name !== undefined) {
      companies.name = updateCompaniesInput.name;
    }
    if (updateCompaniesInput.state !== undefined) {
      companies.state = updateCompaniesInput.state;
    }
    if (updateCompaniesInput.website !== undefined) {
      companies.website = updateCompaniesInput.website;
    }
    if (updateCompaniesInput.zip !== undefined) {
      companies.zip = updateCompaniesInput.zip;
    }

    return this.companyRepository.save(companies);
  }

  async softDeleteCompanies(id: number): Promise<Companies> {
    const companies = await this.companyRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!companies) {
      throw new NotFoundException(`Companies with id ${id} not found`);
    }
    companies.deletedAt = new Date().toISOString();

    return this.companyRepository.save(companies);
  }
}
