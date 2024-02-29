import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Users } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { UserAccessLevel } from 'src/user_access_level/entities/user_access_level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Role, UserAccessLevel])],
  providers: [UsersService, IdService, Role, UserAccessLevel],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
