import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UserAccessLevel } from 'src/user_access_level/entities/user_access_level.entity';
import { Users } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserAccessLevel, Users])],
  providers: [RoleResolver, RoleService, Role],
  controllers: [RoleController],
})
export class RoleModule {}
