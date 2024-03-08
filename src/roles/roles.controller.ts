import { Body, Controller, Post } from '@nestjs/common';
import { CreateRolesInput } from './dto/create-roles.input';
import { RolesService } from './roles.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }
 @Public()
  @Post()
  async createRoles(@Body() createRolesInputs: CreateRolesInput[]): Promise<any> {
    try {
      const createdRoles = await Promise.all(
        createRolesInputs.map((input) => this.rolesService.createRoles(input)),
      );
      return createdRoles;
    } catch (error) {
      throw error;
    }
  }
}
