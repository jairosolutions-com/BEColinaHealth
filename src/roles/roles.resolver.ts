import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Roles } from './entities/roles.entity';
import { CreateRolesInput } from './dto/create-roles.input';
import { UpdateRolesInput } from './dto/update-roles.input';

@Resolver(() => Roles)
export class RolesResolver { }
