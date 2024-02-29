import { IsEmail } from 'class-validator';

export class CreateUserInput {
  uuid: string;
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  password: string;
  fName: string;
  lName: string;
  status: string;
}
