import { IsNotEmpty } from 'class-validator';

export class CreateSurgeriesDto {
  @IsNotEmpty()
  patientId: number;
  @IsNotEmpty()
  typeOfSurgeries: string;
  @IsNotEmpty()
  dateOfSurgeries: Date;
  notes: string;
  uuid: string;
}
