import { Module } from '@nestjs/common';
import { CountryService } from './countries.service';
// import { CountryResolver } from './countries.resolver';
import { CountryController } from './countries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countries } from './entities/countries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Countries])],
  providers: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
