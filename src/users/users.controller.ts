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
  UseGuards,
  Logger,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { ApiKeyGuard } from 'src/auth/api-key/api-key.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  private readonly logger = new Logger(UsersService.name);

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
@Public()
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
      this.logger.error('Failed to create user', error.stack);
      this.logger.error('Error type:', typeof error); // Log the type of error
      this.logger.error('Error:', error); // Log the error object itself
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

  // @Post('reset-password')
  // async requestPasswordReset(@Body() body: { email: string }): Promise<void> {
  //   const { email } = body;

  //   try {
  //     // Generate a reset token for the user and send it to their email
  //     const resetToken = await this.usersService.generateResetToken(email);
  //     // Send the reset token via email here
  //     console.log(`Reset token for ${email}: ${resetToken}`);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       // User not found
  //       console.error('User not found');
  //     } else {
  //       // Other error
  //       console.error('Error:', error.message);
  //     }
  //   }
  // }

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
