import { IsNotEmpty } from 'class-validator';

export class CreateSurgeriesDto {
  @IsNotEmpty()
  uuid: string;
  @IsNotEmpty()
  typeOfSurgeries: string;
  @IsNotEmpty()
  dateOfSurgeries: Date;
  notes: string;
}
