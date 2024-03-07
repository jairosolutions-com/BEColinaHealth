import { IsNotEmpty } from 'class-validator';

export class CreateSurgeryDto {
  @IsNotEmpty()
  patientId: number;
  @IsNotEmpty()
  typeOfSurgery: string;
  @IsNotEmpty()
  dateOfSurgery: Date;
  notes: string;
  uuid: string;
}
