import { Module } from '@nestjs/common';
import { UserAccessLevelService } from './user_access_level.service';
import { UserAccessLevelResolver } from './user_access_level.resolver';
import { UserAccessLevelController } from './user_access_level.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessLevel } from './entities/user_access_level.entity';
import { Role } from 'src/role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccessLevel, Role])],
  providers: [UserAccessLevelResolver, UserAccessLevelService],
  controllers: [UserAccessLevelController],
})
export class UserAccessLevelModule {}
