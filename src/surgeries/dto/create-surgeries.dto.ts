import { IsNotEmpty } from 'class-validator';

export class CreateSurgeriesDto {
  @IsNotEmpty()
  uuid: string;
  @IsNotEmpty()
  typeOfSurgeries: string;
  @IsNotEmpty()
  dateOfSurgeries: Date;
  @IsNotEmpty()
  surgery: string;
  notes: string;
  @IsNotEmpty()
  patientUuid: string;
}
