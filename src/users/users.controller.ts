import { Controller, Post, Body } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { IdService } from 'services/uuid/id.service';
import { Users } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly idService: IdService) {}

  @Post()
  async createUser(@Body() createUserInput: CreateUserInput): Promise<Users> {
    const newUser = new Users();
    newUser.uuid = 'UID' + this.idService.generateRandomUUID(); // Generate userId using IdService
    newUser.email = createUserInput.email;

    // Ensure that the password is not null or undefined
    if (createUserInput.password) {
      newUser.password = await this.hashPassword(createUserInput.password);
    } else {
      // Handle the case where the password is not provided
      throw new Error('Password is required');
    }

    // Save newUser to the database using TypeORM or any other ORM

    return newUser;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust this according to your needs
    return bcrypt.hash(password, saltRounds);
  }
}
