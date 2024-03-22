import { IsNotEmpty } from 'class-validator';

export class CreateSurgeriesDto {
  @IsNotEmpty()
  uuid: string;
  @IsNotEmpty()
  typeOfSurgery: string;
  @IsNotEmpty()
  dateOfSurgery: Date;
  @IsNotEmpty()
  surgery: string;
  notes: string;
  @IsNotEmpty()
  patientUuid: string;
}
