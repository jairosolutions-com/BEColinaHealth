import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpStatus,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<any> {
    return this.usersService.getUserById(id);
  }

  @Get()
  async getAllUsers(): Promise<any> {
    return this.usersService.getAllUsers();
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true })) // Apply ValidationPipe
  async createUser(@Body() createUserInput: CreateUserInput): Promise<any> {
    // Validate email and password
    if (!createUserInput.email || !createUserInput.password) {
      throw new HttpException(
        'Email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if password meets minimum length requirement
    const MIN_PASSWORD_LENGTH = 8;
    if (createUserInput.password.length < MIN_PASSWORD_LENGTH) {
      throw new HttpException(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.usersService.createUser(createUserInput);
    } catch (error) {
      if (
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.CONFLICT
      ) {
        // Email already exists
        throw error;
      } else {
        // Other errors
        throw new HttpException(
          'Failed to create user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
