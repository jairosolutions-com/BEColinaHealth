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
    console.log(countries, 'countries')
    return countries;
  }

}
