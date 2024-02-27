import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryResolver } from './country.resolver';
import { CountryController } from './country.controller';

@Module({
  providers: [CountryResolver, CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
