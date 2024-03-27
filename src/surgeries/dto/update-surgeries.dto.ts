import { PartialType } from '@nestjs/mapped-types';
import { CreateSurgeriesDto } from './create-surgeries.dto';
import { IsNotEmpty } from 'class-validator';
import { Field } from '@nestjs/graphql';

export class UpdateSurgeriesDto extends PartialType(CreateSurgeriesDto) {
  @Field()
  @IsNotEmpty()
  uuid: string;
  @Field()
  @IsNotEmpty()
  typeOfSurgery: string;
  @Field()
  @IsNotEmpty()
  dateOfSurgery: Date;
  @Field()
  @IsNotEmpty()
  surgery: string;
  notes: string;
  @Field()
  @IsNotEmpty()
  patientUuid: string;
}
