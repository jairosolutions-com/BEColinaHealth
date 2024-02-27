import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VitalSignsService } from './vital_signs.service';
import { VitalSign } from './entities/vital_sign.entity';
import { CreateVitalSignInput } from './dto/create-vital_sign.input';
import { UpdateVitalSignInput } from './dto/update-vital_sign.input';

@Resolver(() => VitalSign)
export class VitalSignsResolver {
  constructor(private readonly vitalSignsService: VitalSignsService) {}

  @Mutation(() => VitalSign)
  createVitalSign(@Args('createVitalSignInput') createVitalSignInput: CreateVitalSignInput) {
    return this.vitalSignsService.create(createVitalSignInput);
  }

  @Query(() => [VitalSign], { name: 'vitalSigns' })
  findAll() {
    return this.vitalSignsService.findAll();
  }

  @Query(() => VitalSign, { name: 'vitalSign' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.vitalSignsService.findOne(id);
  }

  @Mutation(() => VitalSign)
  updateVitalSign(@Args('updateVitalSignInput') updateVitalSignInput: UpdateVitalSignInput) {
    return this.vitalSignsService.update(updateVitalSignInput.id, updateVitalSignInput);
  }

  @Mutation(() => VitalSign)
  removeVitalSign(@Args('id', { type: () => Int }) id: number) {
    return this.vitalSignsService.remove(id);
  }
}
