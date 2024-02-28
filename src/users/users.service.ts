import {
  Injectable,
  HttpException,
  HttpStatus,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, FindManyOptions, ILike, IsNull, Like, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { Users } from './entities/user.entity';
import { IdService } from 'services/uuid/id.service'; // Import IdService
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly idService: IdService,
  ) {}

  async getUserById(id: number): Promise<Users | undefined> {
    return this.usersRepository.findOne({ where: { Id: id } });
  }

  async getAllUsers(
    @Query('page') page: number = 1, // Default to page 1 if not provided
    @Query('limit') limit: number = 10, // Default limit to 10 if not provided
  ): Promise<{ users: Users[]; total: number }> {
    const [users, total] = await this.usersRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' },
    });
    return { users, total };
  }

  async searchUsers(
    keyword: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: Users[]; total: number }> {
    const options: FindManyOptions<Users> = {
      where: [
        { email: ILike(`%${keyword}%`) },
        { uuid: ILike(`%${keyword}%`) },
        { fName: ILike(`%${keyword}%`) },
        { lName: ILike(`%${keyword}%`) },
      ],
      take: limit,
      skip: (page - 1) * limit,
    };

    const [users, total] = await this.usersRepository.findAndCount(options);

    return { users, total };
  }

  async getUserByEmail(email: string): Promise<Users | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async verifyPassword(user: Users, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async searchUsersByEmail(
    email: string,
    offset: number,
    limit: number,
  ): Promise<any> {
    const lowercaseEmail = email.toLowerCase();
    return this.usersRepository.find({
      where: {
        email: ILike(`%${lowercaseEmail}%`),
      },
      skip: offset,
      take: limit,
      order: { created_at: 'DESC' },
    });
  }

  async searchUsersByLastName(
    lName: string,
    offset: number,
    limit: number,
  ): Promise<any> {
    const lowercaseLname = lName.toLowerCase();
    return this.usersRepository.find({
      where: {
        lName: ILike(`%${lowercaseLname}%`),
      },
      skip: offset,
      take: limit,
      order: { created_at: 'DESC' },
    });
  }

  async searchUsersByFirstName(
    fName: string,
    offset: number,
    limit: number,
  ): Promise<any> {
    const lowercaseLname = fName.toLowerCase();
    return this.usersRepository.find({
      where: {
        fName: ILike(`%${lowercaseLname}%`),
      },
      skip: offset,
      take: limit,
      order: { created_at: 'DESC' },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async createUser(createUserInput: CreateUserInput): Promise<Users> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: ILike(`%${createUserInput.email}%`) }, // Use ILike for case-insensitive comparison
    });

    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const newUser = new Users();
    const currentDate = new Date().toISOString();
    newUser.uuid = this.idService.generateRandomUUID('UID-');
    newUser.email = createUserInput.email;
    newUser.fName = createUserInput.fName;
    newUser.lName = createUserInput.lName;
    newUser.status = createUserInput.status;
    newUser.updated_at = createUserInput.updated_at;
    newUser.created_at = currentDate;
    newUser.deleted_at = createUserInput.deleted_at;

    if (!createUserInput.password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    newUser.password = await this.hashPassword(createUserInput.password);

    return this.usersRepository.save(newUser);
  }

  // UPDATE

  async updateUser(
    Id: number,
    updateUserInput: UpdateUserInput,
  ): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { Id } });
    const currentDate = new Date().toISOString();
    if (!user) {
      throw new Error(`User with ID ${Id} not found`);
    }

    // Update user properties if provided in updateUserInput
    if (updateUserInput.email !== undefined) {
      user.email = updateUserInput.email;
    }
    if (updateUserInput.password !== undefined) {
      user.password = updateUserInput.password;
    }
    if (updateUserInput.fName !== undefined) {
      user.fName = updateUserInput.fName;
    }
    if (updateUserInput.lName !== undefined) {
      user.lName = updateUserInput.lName;
    }
    if (updateUserInput.status !== undefined) {
      user.status = updateUserInput.status;
    }

    user.updated_at = currentDate;

    // Save and return the updated user
    return this.usersRepository.save(user);
  }

  async softDeleteUser(Id: number): Promise<Users> {
    // Check if the user exists
    const user = await this.usersRepository.findOne({ where: { Id: Id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${Id} not found`);
    }

    // Soft-delete the user by setting the deleted_at field
    user.deleted_at = new Date().toISOString();

    // Save and return the updated user
    return this.usersRepository.save(user);
  }
}
