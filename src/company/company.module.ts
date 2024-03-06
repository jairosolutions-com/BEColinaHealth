import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { CompanyController } from './company.controller';

@Module({
  providers: [CompanyResolver, CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
