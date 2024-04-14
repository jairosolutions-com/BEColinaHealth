import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { Forms } from './entities/form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Forms, Patients])],
  controllers: [FormsController],
  providers: [FormsService, IdService],
})
export class FormsModule {}
