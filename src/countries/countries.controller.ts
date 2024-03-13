import { Controller, Post } from '@nestjs/common';
import { Countries } from './entities/countries.entity';
import { CountryService } from './countries.service';

@Controller('countries')
export class CountryController {
    constructor(private readonly countriesService: CountryService) { }

    @Post()
    async getAllCountries(
    ): Promise<Countries[]> {
        return this.countriesService.getAllCountries();
    }
}
