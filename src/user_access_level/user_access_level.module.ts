import { Module } from '@nestjs/common';
import { UserAccessLevelService } from './user_access_level.service';
import { UserAccessLevelResolver } from './user_access_level.resolver';
import { UserAccessLevelController } from './user_access_level.controller';

@Module({
  providers: [UserAccessLevelResolver, UserAccessLevelService],
  controllers: [UserAccessLevelController],
})
export class UserAccessLevelModule {}
