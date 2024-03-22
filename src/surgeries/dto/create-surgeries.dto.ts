import { Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

export class CreateSurgeriesDto {
  @Field()
  @IsNotEmpty()
  uuid: string;
  @Field()
  @IsNotEmpty()
  typeOfSurgeries: string;
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
