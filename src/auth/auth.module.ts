import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { IdService } from 'services/uuid/id.service';
import { JwtModule } from '@nestjs/jwt';
import { Roles } from 'src/roles/entities/roles.entity';
import { UserAccessLevels } from 'src/userAccessLevels/entities/userAccessLevels.entity';
// import { jwtConstants } from './constant';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';
// import { EmailService } from 'src/users/email.service';
{
}
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.local' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET, // Replace with your own secret key
      signOptions: { expiresIn: '30d' }, // Optional: Set expiration time for tokens
    }),
    TypeOrmModule.forFeature([Users, Roles, UserAccessLevels]),
  ],
  providers: [
    AuthService,
    UsersService,
    IdService,
    // EmailService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
