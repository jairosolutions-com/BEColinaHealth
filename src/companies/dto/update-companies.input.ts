import { IsOptional } from 'class-validator';

export class UpdateCompaniesInput {
  @IsOptional()
  name: string;

  @IsOptional()
  contactNo: string;

  @IsOptional()
  website: string;

  @IsOptional()
  email: string;

  @IsOptional()
  countries: string;

  @IsOptional()
  state: string;

  @IsOptional()
  zip: string;
}
