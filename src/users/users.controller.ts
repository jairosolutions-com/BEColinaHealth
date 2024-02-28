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
  Query,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UsersService } from './users.service';
import { Users } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  async searchUsers(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ users: Users[]; total: number }> {
    return this.usersService.searchUsers(keyword, page, limit);
  }
  @Get('searchByEmail')
  async searchUsersByEmail(
    @Query('email') email: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    try {
      // Calculate the offset based on the page and limit
      const offset = (page - 1) * limit;

      // Perform the search with pagination
      const users = await this.usersService.searchUsersByEmail(
        email,
        offset,
        limit,
      );

      if (users.length === 0) {
        // Return an empty array if no users are found
        return { users: [] };
      }

      // Return the paginated users
      return { users };
    } catch (error) {
      throw new HttpException(
        'Failed to search users by email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('searchByLastName')
  async searchUsersByLastName(
    @Query('lName') lName: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    try {
      // Calculate the offset based on the page and limit
      const offset = (page - 1) * limit;

      // Perform the search with pagination
      const users = await this.usersService.searchUsersByLastName(
        lName,
        offset,
        limit,
      );

      if (users.length === 0) {
        // Return an empty array if no users are found
        return { users: [] };
      }

      // Return the paginated users
      return { users };
    } catch (error) {
      throw new HttpException(
        'Failed to search users by last name',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('searchByFirstName')
  async searchUsersByFirstName(
    @Query('fName') fName: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    try {
      // Calculate the offset based on the page and limit
      const offset = (page - 1) * limit;

      // Perform the search with pagination
      const users = await this.usersService.searchUsersByFirstName(
        fName,
        offset,
        limit,
      );

      if (users.length === 0) {
        // Return an empty array if no users are found
        return { users: [] };
      }

      // Return the paginated users
      return { users };
    } catch (error) {
      throw new HttpException(
        'Failed to search users by first name',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<any> {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Get()
  async getAllUsersPagination(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ users: Users[]; total: number }> {
    return this.usersService.getAllUsers(page, limit);
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

  @Patch('update/:Id')
  async updateUser(
    @Param('Id') Id: number,
    @Body() updateUserInput: UpdateUserInput,
  ): Promise<Users> {
    const updatedUser = await this.usersService.updateUser(Id, updateUserInput);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${Id} not found`);
    }
    return updatedUser;
  }

  @Patch('delete/:Id')
  async softDeleteUser(@Param('Id') Id: number): Promise<Users> {
    const updatedUser = await this.usersService.softDeleteUser(Id);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${Id} not found`);
    }
    return updatedUser;
  }
}
