import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRolesInput } from './dto/create-roles.input';
import { UpdateRolesInput } from './dto/update-roles.input';
import { Roles } from './entities/roles.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) { }
  async createRoles(createRolesInput: CreateRolesInput): Promise<Roles> {
    const existingRoles = await this.rolesRepository.findOne({
      where: {
        name: ILike(`%${createRolesInput.name}%`),
      },
    });
    if (existingRoles) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const newRoles = new Roles();
    newRoles.name = createRolesInput.name;
    newRoles.description = createRolesInput.description;

    const savedRoles = await this.rolesRepository.save(newRoles);

    return savedRoles;
  }
}
