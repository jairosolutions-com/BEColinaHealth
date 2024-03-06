import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from './entities/role.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async createRole(createRoleInput: CreateRoleInput): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: {
        name: ILike(`%${createRoleInput.name}%`),
      },
    });
    if (existingRole) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const newRole = new Role();
    newRole.name = createRoleInput.name;
    newRole.description = createRoleInput.description;

    const savedRole = await this.roleRepository.save(newRole);

    return savedRole;
  }
}
