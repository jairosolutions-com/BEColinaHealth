import { Injectable } from '@nestjs/common';
import { CreateCountryInput } from './dto/create-countries.input';
import { UpdateCountryInput } from './dto/update-countries.input';

@Injectable()
export class CountryService {
  create(createCountryInput: CreateCountryInput) {
    return 'This action adds a new countries';
  }

  findAll() {
    return `This action returns all countries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} countries`;
  }

  update(id: number, updateCountryInput: UpdateCountryInput) {
    return `This action updates a #${id} countries`;
  }

  remove(id: number) {
    return `This action removes a #${id} countries`;
  }
}
