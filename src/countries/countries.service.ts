import { Injectable } from '@nestjs/common';
import { CreateCountryInput } from './dto/create-countries.input';
import { UpdateCountryInput } from './dto/update-countries.input';
import { Countries } from './entities/countries.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Countries)
    private readonly countriesRepository: Repository<Countries>,
  ) { }
  create(createCountryInput: CreateCountryInput) {
    return 'This action adds a new countries';
  }

  async getAllCountries(): Promise<Countries[]> {
    const countries = await this.countriesRepository.find({
    });
    return countries;
  }


  findOne(id: number) {
    return `This action returns a #${id} countries`;
  }

  update(id: string, updateCountryInput: UpdateCountryInput) {
    return `This action updates a #${id} countries`;
  }

  remove(id: number) {
    return `This action removes a #${id} countries`;
  }
}
