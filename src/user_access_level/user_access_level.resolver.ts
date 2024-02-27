import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserAccessLevelService } from './user_access_level.service';
import { UserAccessLevel } from './entities/user_access_level.entity';
import { CreateUserAccessLevelInput } from './dto/create-user_access_level.input';
import { UpdateUserAccessLevelInput } from './dto/update-user_access_level.input';

@Resolver(() => UserAccessLevel)
export class UserAccessLevelResolver {
  constructor(private readonly userAccessLevelService: UserAccessLevelService) {}

  @Mutation(() => UserAccessLevel)
  createUserAccessLevel(@Args('createUserAccessLevelInput') createUserAccessLevelInput: CreateUserAccessLevelInput) {
    return this.userAccessLevelService.create(createUserAccessLevelInput);
  }

  @Query(() => [UserAccessLevel], { name: 'userAccessLevel' })
  findAll() {
    return this.userAccessLevelService.findAll();
  }

  @Query(() => UserAccessLevel, { name: 'userAccessLevel' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userAccessLevelService.findOne(id);
  }

  @Mutation(() => UserAccessLevel)
  updateUserAccessLevel(@Args('updateUserAccessLevelInput') updateUserAccessLevelInput: UpdateUserAccessLevelInput) {
    return this.userAccessLevelService.update(updateUserAccessLevelInput.id, updateUserAccessLevelInput);
  }

  @Mutation(() => UserAccessLevel)
  removeUserAccessLevel(@Args('id', { type: () => Int }) id: number) {
    return this.userAccessLevelService.remove(id);
  }
}
