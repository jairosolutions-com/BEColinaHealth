import { IsOptional } from 'class-validator';

export class UpdateCompanyInput {
  @IsOptional()
  name: string;

  @IsOptional()
  contactNo: string;

  @IsOptional()
  website: string;

  @IsOptional()
  email: string;

  @IsOptional()
  country: string;

  @IsOptional()
  state: string;

  @IsOptional()
  zip: string;
}
