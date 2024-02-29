import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'src/auth/api-key/api-key.guard';
import { CreateRoleInput } from './dto/create-role.input';
import { RoleService } from './role.service';

@Controller('role')
@UseGuards(ApiKeyGuard)
export class RoleController {}
