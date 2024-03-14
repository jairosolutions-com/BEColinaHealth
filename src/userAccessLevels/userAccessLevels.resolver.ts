// import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// import { UserAccessLevelsService } from './userAccessLevels.service';
// import { UserAccessLevels } from './entities/userAccessLevels.entity';
// import { CreateUserAccessLevelsInput } from './dto/create-userAccessLevels.input';
// import { UpdateUserAccessLevelsInput } from './dto/update-userAccessLevels.input';

// @Resolver(() => UserAccessLevels)
// export class UserAccessLevelsResolver {
//   constructor(private readonly userAccessLevelsService: UserAccessLevelsService) {}

//   @Mutation(() => UserAccessLevels)
//   createUserAccessLevels(@Args('createUserAccessLevelsInput') createUserAccessLevelsInput: CreateUserAccessLevelsInput) {
//     return this.userAccessLevelsService.create(createUserAccessLevelsInput);
//   }

//   @Query(() => [UserAccessLevels], { name: 'userAccessLevels' })
//   findAll() {
//     return this.userAccessLevelsService.findAll();
//   }

//   @Query(() => UserAccessLevels, { name: 'userAccessLevels' })
//   findOne(@Args('id', { type: () => Int }) id: number) {
//     return this.userAccessLevelsService.findOne(id);
//   }

//   @Mutation(() => UserAccessLevels)
//   updateUserAccessLevels(@Args('updateUserAccessLevelsInput') updateUserAccessLevelsInput: UpdateUserAccessLevelsInput) {
//     return this.userAccessLevelsService.update(updateUserAccessLevelsInput.id, updateUserAccessLevelsInput);
//   }

//   @Mutation(() => UserAccessLevels)
//   removeUserAccessLevels(@Args('id', { type: () => Int }) id: number) {
//     return this.userAccessLevelsService.remove(id);
//   }
// }
