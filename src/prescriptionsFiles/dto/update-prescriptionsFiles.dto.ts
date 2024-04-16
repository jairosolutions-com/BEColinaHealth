import { PartialType } from '@nestjs/mapped-types';
import { CreatePrescriptionsFileDto } from './create-prescriptionsFiles.dto';
export class UpdatePrescriptionsFileDto extends PartialType(CreatePrescriptionsFileDto) { }
