import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/roles/entities/roles.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateUserAccessLevelsInput } from './dto/update-userAccessLevels.input';
import { UserAccessLevels } from './entities/userAccessLevels.entity';
import { NotFoundException } from '@nestjs/common';

export class UserAccessLevelsService {
  constructor(
    @InjectRepository(UserAccessLevels)
    private userAccessLevelsRepository: Repository<UserAccessLevels>,
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>, // Inject Roles repository
  ) { }

  async update(
    users: number,
    updateUserAccessLevelsInput: UpdateUserAccessLevelsInput,
  ): Promise<UserAccessLevels> {
    const { roles } = updateUserAccessLevelsInput;

    // Find the user access level by userId
    const userAccessLevels = await this.userAccessLevelsRepository.findOne({
      where: { users: { id: users } },
    } as FindOneOptions<UserAccessLevels>);
    if (!userAccessLevels) {
      throw new NotFoundException('User access level not found');
    }

    // Fetch the new roles based on rolesId
    const newRoles = await this.rolesRepository.findOne({
      where: { id: roles },
    });
    if (!newRoles) {
      throw new NotFoundException('Roles not found');
    }

    // Update rolesId
    userAccessLevels.roles = newRoles;

    // Save changes
    await this.userAccessLevelsRepository.save(userAccessLevels);

    return userAccessLevels;
  }
}
