import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateUserAccessLevelInput } from './dto/update-user_access_level.input';
import { UserAccessLevel } from './entities/user_access_level.entity';
import { NotFoundException } from '@nestjs/common';

export class UserAccessLevelService {
  constructor(
    @InjectRepository(UserAccessLevel)
    private userAccessLevelRepository: Repository<UserAccessLevel>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>, // Inject Role repository
  ) {}

  async update(
    users: number,
    updateUserAccessLevelInput: UpdateUserAccessLevelInput,
  ): Promise<UserAccessLevel> {
    const { role } = updateUserAccessLevelInput;

    // Find the user access level by userId
    const userAccessLevel = await this.userAccessLevelRepository.findOne({
      where: { users: { id: users } },
    } as FindOneOptions<UserAccessLevel>);
    if (!userAccessLevel) {
      throw new NotFoundException('User access level not found');
    }

    // Fetch the new role based on roleId
    const newRole = await this.roleRepository.findOne({
      where: { id: role },
    });
    if (!newRole) {
      throw new NotFoundException('Role not found');
    }

    // Update roleId
    userAccessLevel.role = newRole;

    // Save changes
    await this.userAccessLevelRepository.save(userAccessLevel);

    return userAccessLevel;
  }
}
