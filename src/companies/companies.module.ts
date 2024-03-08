import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
// import { CompaniesResolver } from './companies.resolver';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from './entities/companies.entity';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([Companies])],
  providers: [CompaniesService, IdService],
  controllers: [CompaniesController],
})
export class CompaniesModule { }
