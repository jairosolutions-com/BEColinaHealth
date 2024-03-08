import { PartialType } from '@nestjs/mapped-types';
import { CreateSurgeriesDto } from './create-surgeries.dto';

export class UpdateSurgeriesDto extends PartialType(CreateSurgeriesDto) { }
