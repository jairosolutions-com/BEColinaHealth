import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Users } from './entities/users.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { UserAccessLevels } from 'src/userAccessLevels/entities/userAccessLevels.entity';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { EmailService } from './email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Roles, UserAccessLevels]),
    // MailerModule.forRoot({
    //   transport: {
    //     service: 'gmail',
    //     auth: {
    //       user: 'kentjohnliloc@yahoo.com',
    //       pass: 'yqiwjkjseyubyxxt',
    //     },
    //   },
    // }),
  ],
  providers: [UsersService, IdService, Roles, UserAccessLevels],
  controllers: [UsersController],
  exports: [
    UsersService,
    // EmailService
  ],
})
export class UsersModule { }
