import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { RoleController } from './role.controller';

@Module({
  providers: [RoleResolver, RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
