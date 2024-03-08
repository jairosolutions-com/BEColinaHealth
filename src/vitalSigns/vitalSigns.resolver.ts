import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateVitalSignInput } from './dto/create-vitalSigns.input';
import { UpdateVitalSignInput } from './dto/update-vitalSigns.input';
import { VitalSigns } from './entities/vitalSigns.entity';
import { VitalSignsService } from './vitalSigns.service';

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
