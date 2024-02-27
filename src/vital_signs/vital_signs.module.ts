import { Module } from '@nestjs/common';
import { VitalSignsService } from './vital_signs.service';
import { VitalSignsResolver } from './vital_signs.resolver';
import { VitalSignsController } from './vital_signs.controller';

@Module({
  providers: [VitalSignsResolver, VitalSignsService],
  controllers: [VitalSignsController],
})
export class VitalSignsModule {}
