import { Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

export class CreateSurgeriesDto {
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
  patientId: number;
}
