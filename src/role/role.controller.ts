import { Body, Controller, Post } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRoles(@Body() createRoleInputs: CreateRoleInput[]): Promise<any> {
    try {
      const createdRoles = await Promise.all(
        createRoleInputs.map((input) => this.roleService.createRole(input)),
      );
      return createdRoles;
    } catch (error) {
      throw error;
    }
  }
}
