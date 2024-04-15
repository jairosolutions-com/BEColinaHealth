import { PartialType } from '@nestjs/mapped-types';
import { CreateLabResultsFileDto } from './create-labResultsFiles.dto';

export class UpdateLabResultsFileDto extends PartialType(CreateLabResultsFileDto) { }
