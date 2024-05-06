import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Users } from './entities/users.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { UserAccessLevels } from 'src/userAccessLevels/entities/userAccessLevels.entity';
import { OtpService } from 'services/otp/otp.service';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from 'services/email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.local' }),
    TypeOrmModule.forFeature([Users, Roles, UserAccessLevels]),
  ],
  providers: [
    UsersService,
    IdService,
    Roles,
    UserAccessLevels,
    OtpService,
    EmailService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
