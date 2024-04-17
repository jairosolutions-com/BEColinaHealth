import { PartialType } from '@nestjs/mapped-types';
import { CreateFormFileDto } from './create-formFile.dto';

export class UpdateFormFileDto extends PartialType(CreateFormFileDto) { }
