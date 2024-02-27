import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './medical_history.service';
import { MedicalHistoryResolver } from './medical_history.resolver';
import { MedicalHistoryController } from './medical_history.controller';

@Module({
  providers: [MedicalHistoryResolver, MedicalHistoryService],
  controllers: [MedicalHistoryController],
})
export class MedicalHistoryModule {}
