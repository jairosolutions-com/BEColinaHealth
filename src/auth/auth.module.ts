import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { IdService } from 'services/uuid/id.service';
{
}
@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [AuthService, UsersService, IdService],
  controllers: [AuthController],
})
export class AuthModule {}
