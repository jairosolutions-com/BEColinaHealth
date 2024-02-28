import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { Users } from './entities/user.entity';
import { IdService } from 'services/uuid/id.service'; // Import IdService
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly idService: IdService,
  ) {}

  async getUserById(id: string): Promise<Users | undefined> {
    return this.usersRepository.findOne({ where: { uuid: id } });
  }

  async getAllUsers(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async getUserByEmail(email: string): Promise<Users | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createUser(createUserInput: CreateUserInput): Promise<Users> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserInput.email },
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

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
