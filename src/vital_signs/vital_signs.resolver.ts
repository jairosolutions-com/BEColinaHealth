import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateVitalSignInput } from './dto/create-vital_sign.input';
import { UpdateVitalSignInput } from './dto/update-vital_sign.input';
import { VitalSigns } from './entities/vital_sign.entity';
import { VitalSignsService } from './vital_signs.service';

@Resolver(() => VitalSigns)
export class VitalSignsResolver {
//   constructor(private readonly vitalSignsService: VitalSignsService) {}

//   @Mutation(() => VitalSigns)
//   createVitalSign(
//     @Args('createVitalSignInput') createVitalSignInput: CreateVitalSignInput,
//   ) {
//     return this.vitalSignsService.create(createVitalSignInput);
//   }

//   @Query(() => [VitalSigns], { name: 'vitalSigns' })
//   findAll() {
//     return this.vitalSignsService.findAll();
//   }

//   @Query(() => VitalSigns, { name: 'vitalSign' })
//   findOne(@Args('id', { type: () => Int }) id: number) {
//     return this.vitalSignsService.findOne(id);
//   }

//   @Mutation(() => VitalSigns)
//   updateVitalSign(
//     @Args('updateVitalSignInput') updateVitalSignInput: UpdateVitalSignInput,
//   ) {
//     return this.vitalSignsService.update(
//       updateVitalSignInput.id,
//       updateVitalSignInput,
//     );
//   }

//   @Mutation(() => VitalSigns)
//   removeVitalSign(@Args('id', { type: () => Int }) id: number) {
//     return this.vitalSignsService.remove(id);
//   }
}
