import { Controller, Param, Body, Put, UseGuards, Patch } from '@nestjs/common';
import { UpdateUserAccessLevelInput } from './dto/update-user_access_level.input';
import { UserAccessLevel } from './entities/user_access_level.entity';
import { UserAccessLevelService } from './user_access_level.service';
import { ApiKeyGuard } from 'src/auth/api-key/api-key.guard';

@Controller('user-access-level')
@UseGuards(ApiKeyGuard)
export class UserAccessLevelController {
  constructor(
    private readonly userAccessLevelService: UserAccessLevelService,
  ) {}

  @Patch(':users')
  async update(
    @Param('users') users: number,
    @Body() updateUserAccessLevelInput: UpdateUserAccessLevelInput,
  ): Promise<UserAccessLevel> {
    return this.userAccessLevelService.update(
      users,
      updateUserAccessLevelInput,
    );
  }
}
