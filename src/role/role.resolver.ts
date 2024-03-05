import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Resolver(() => Role)
export class RoleResolver {}
