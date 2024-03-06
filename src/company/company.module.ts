import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
// import { CompanyResolver } from './company.resolver';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [CompanyService, IdService],
  controllers: [CompanyController],
})
export class CompanyModule {}
