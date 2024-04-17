import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Countries } from './entities/countries.entity';
import { CountryService } from './countries.service';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('countries')
@UseGuards(AuthGuard)
export class CountryController {
  constructor(private readonly countriesService: CountryService) { }

  @Get()
  async getAllCountries(): Promise<Countries[]> {
    return this.countriesService.getAllCountries();
  }

  @Post('add')
  async addCountry(): Promise<Countries[]> {
    return this.countriesService.addAllCountries();
  }
}
