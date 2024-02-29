import { Controller, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'src/auth/api-key/api-key.guard';

@Controller('role')
@UseGuards(ApiKeyGuard)
export class RoleController {}
