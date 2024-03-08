import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { UserAccessLevels } from 'src/userAccessLevels/entities/userAccessLevels.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, UserAccessLevels, Users])],
  providers: [RolesResolver, RolesService, Roles],
  controllers: [RolesController],
})
export class RolesModule { }
