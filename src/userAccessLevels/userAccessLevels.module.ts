import { Module } from '@nestjs/common';
import { UserAccessLevelsService } from './userAccessLevels.service';
// import { UserAccessLevelsResolver } from './userAccessLevels.resolver';
import { UserAccessLevelsController } from './userAccessLevels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessLevels } from './entities/userAccessLevels.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccessLevels, Roles, Users])],
  providers: [UserAccessLevelsService, UserAccessLevels],
  controllers: [UserAccessLevelsController],
})
export class UserAccessLevelsModule { }
