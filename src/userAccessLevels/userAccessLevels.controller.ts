import { Controller, Param, Body, Put, UseGuards, Patch } from '@nestjs/common';
import { UpdateUserAccessLevelsInput } from './dto/update-userAccessLevels.input';
import { UserAccessLevels } from './entities/userAccessLevels.entity';
import { UserAccessLevelsService } from './userAccessLevels.service';
import { ApiKeyGuard } from 'src/auth/api-key/api-key.guard';

@Controller('user-access-levels')
@UseGuards(ApiKeyGuard)
export class UserAccessLevelsController {
  constructor(
    private readonly userAccessLevelsService: UserAccessLevelsService,
  ) { }

  @Patch(':users')
  async update(
    @Param('users') users: number,
    @Body() updateUserAccessLevelsInput: UpdateUserAccessLevelsInput,
  ): Promise<UserAccessLevels> {
    return this.userAccessLevelsService.update(
      users,
      updateUserAccessLevelsInput,
    );
  }
}
