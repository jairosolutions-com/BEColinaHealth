import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserInput {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  confirmPassword?: string;

  @IsOptional()
  fName?: string;

  @IsOptional()
  lName?: string;

  @IsOptional()
  status?: string;
}
