import { Injectable } from '@nestjs/common';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';

@Injectable()
export class CountryService {
  create(createCountryInput: CreateCountryInput) {
    return 'This action adds a new country';
  }

  findAll() {
    return `This action returns all country`;
  }

  findOne(id: number) {
    return `This action returns a #${id} country`;
  }

  update(id: number, updateCountryInput: UpdateCountryInput) {
    return `This action updates a #${id} country`;
  }

  remove(id: number) {
    return `This action removes a #${id} country`;
  }
}
