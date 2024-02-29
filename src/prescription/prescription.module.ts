import { Module } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { PrescriptionResolver } from './prescription.resolver';
import { PrescriptionController } from './prescription.controller';

@Module({
  providers: [PrescriptionResolver, PrescriptionService],
  controllers: [PrescriptionController],
})
export class PrescriptionModule {}
