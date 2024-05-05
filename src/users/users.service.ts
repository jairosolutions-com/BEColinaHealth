import {
  Injectable,
  HttpException,
  HttpStatus,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Any,
  FindManyOptions,
  ILike,
  IsNull,
  Like,
  MoreThan,
  Repository,
} from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { IdService } from 'services/uuid/id.service'; // Import idService
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/update-user.input';
import { UserAccessLevels } from 'src/userAccessLevels/entities/userAccessLevels.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { Users } from './entities/users.entity';
import { EmailService } from 'services/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(UserAccessLevels)
    private readonly ualRepository: Repository<Roles>,
    private readonly emailService: EmailService,
    private readonly idService: IdService,
  ) {}

  async getUserById(id: number): Promise<Users | undefined> {
    return this.usersRepository.findOne({ where: { id: id } });
  }

  async getAllUsers(
    @Query('page') page: number = 1, // Default to page 1 if not provided
    @Query('limit') limit: number = 10, // Default limit to 10 if not provided
  ): Promise<{ users: Users[]; total: number }> {
    const [users, total] = await this.usersRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
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
      order: { createdAt: 'DESC' },
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
      order: { createdAt: 'DESC' },
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
      order: { createdAt: 'DESC' },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async createUser(createUserInput: CreateUserInput): Promise<Users> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: ILike(`%${createUserInput.email}%`) },
    });

    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const newUser = new Users();
    newUser.uuid = this.idService.generateRandomUUID('UID-');
    newUser.email = createUserInput.email;
    newUser.fName = createUserInput.fName;
    newUser.lName = createUserInput.lName;
    newUser.status = createUserInput.status;

    if (!createUserInput.password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    newUser.password = await this.hashPassword(createUserInput.password);

    // Initially declare savedUser as null or undefined
    let savedUser: Users | null = null;

    let defaultRoles;
    try {
      // Attempt to retrieve the default roles
      defaultRoles = await this.rolesRepository.findOne({ where: { id: 3 } });
      if (!defaultRoles) {
        // If the default roles is not found, throw a specific error for this case
        throw new HttpException(
          'Default roles not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Save the new user to the database
      savedUser = await this.usersRepository.save(newUser);
      const newUserAccessLevels = new UserAccessLevels();
      newUserAccessLevels.users = savedUser; // Assign the user to the user property
      newUserAccessLevels.roles = defaultRoles; // Assign the fetched roles to the roles property

      // Save the new user access level record to the database
      await this.ualRepository.save(newUserAccessLevels);
    } catch (error) {
      // If there's an error retrieving the roles, rethrow or handle it appropriately
      throw new HttpException(
        'Failed to assign default roles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!savedUser) {
      throw new HttpException(
        'User could not be saved',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    delete savedUser.id;
    return savedUser;
  }

  // async createUser(createUserInput: CreateUserInput): Promise<Users> {
  //   // Check if email already exists
  //   const existingUser = await this.usersRepository.findOne({
  //     where: { email: ILike(`%${createUserInput.email}%`) }, // Use ILike for case-insensitive comparison
  //   });

  //   if (existingUser) {
  //     throw new HttpException('Email already exists', HttpStatus.CONFLICT);
  //   }

  //   const newUser = new Users();
  //   newUser.uuid = this.idService.generateRandomUUid('Uid-');
  //   newUser.email = createUserInput.email;
  //   newUser.fName = createUserInput.fName;
  //   newUser.lName = createUserInput.lName;
  //   newUser.status = createUserInput.status;

  //   if (!createUserInput.password) {
  //     throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
  //   }

  //   newUser.password = await this.hashPassword(createUserInput.password);

  //   return this.usersRepository.save(newUser);
  // }

  // UPDATE

  async updateOTP(id: number, otp: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    user.otp = otp;

    return this.usersRepository.save(user);
  }

  async getOTP(email: string): Promise<string | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    return user.otp;
  }

  async sendPasswordResetEmail(emailAddress: string, otp: string) {
    const subject = 'Password Reset Request (OTP)';
    const message = `${otp}`
    await this.emailService.sendEmail(
      emailAddress,
      subject,
      emailAddress,
      message,
    );
  }

  async updateUser(
    email: string,
    updateUserInput: UpdateUserInput,
  ): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    // Update user properties if provided in updateUserInput
    if (updateUserInput.email !== undefined) {
      user.email = updateUserInput.email;
    }
    if (updateUserInput.password !== undefined) {
      const newPassword = await this.hashPassword(updateUserInput.password);
      user.password = newPassword;
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

    // Save and return the updated user
    return this.usersRepository.save(user);
  }

  async softDeleteUser(id: number): Promise<Users> {
    // Check if the user exists
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.deletedAt = new Date().toISOString();
    // Save and return the updated user
    return this.usersRepository.save(user);
  }

  // async generateResetToken(email: string): Promise<string> {
  //   const user = await this.getUserByEmail(email);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   try {
  //     // Generate a reset token for the user
  //     const resetToken = await this.generateResetToken(email);

  //     // Send the reset token via email
  //     await this.emailService.sendResetToken(email, resetToken);

  //     console.log(`Reset token for ${email} sent successfully`);
  //   } catch (error) {
  //     // Handle errors
  //     console.error('Error sending reset token email:', error);
  //     throw new Error('Failed to send reset token email');
  //   }
  //   const resetToken = randomBytes(20).toString('hex');
  //   const resetTokenExpires = new Date();
  //   resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Token expires in 1 hour

  //   await this.usersRepository.update(user.id, {
  //     resetToken,
  //     resetTokenExpires,
  //   });

  //   return resetToken;
  // }

  // async findByResetToken(token: string): Promise<Users> {
  //   return await this.usersRepository.findOne({
  //     where: {
  //       resetToken: token,
  //       resetTokenExpires: MoreThan(new Date()),
  //     },
  //   });
  // }

  // async resetPassword(token: string, newPassword: string): Promise<void> {
  //   const user = await this.findByResetToken(token);
  //   if (!user) {
  //     throw new Error('Invalid or expired token');
  //   }

  //   // Update the user's password and clear the reset token fields
  //   await this.usersRepository.update(user.id, {
  //     password: newPassword,
  //     resetToken: null,
  //     resetTokenExpires: null,
  //   });
  // }
}
