import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Prescriptions } from './entities/prescriptions.entity';
import { PrescriptionsService } from './prescriptions.service';

@Resolver(() => Prescriptions)
export class PrescriptionsResolver {
  constructor(private readonly prescriptionsService: PrescriptionsService) { }

  // @Mutation(() => Prescriptions)
  // createPrescriptions(@Args('createPrescriptionsInput') createPrescriptionsInput: CreatePrescriptionsInput) {
  //   return this.prescriptionsService.createPrescriptions(createPrescriptionsInput);
  // }

  // // @Query(() => [Prescriptions], { name: 'prescriptions' })
  // // findAll() {
  // //   return this.prescriptionsService.findAll();
  // // }

  // // @Query(() => Prescriptions, { name: 'prescriptions' })
  // // findOne(@Args('id', { type: () => Int }) id: number) {
  // //   return this.prescriptionsService.findOne(id);
  // // }

  // @Mutation(() => Prescriptions)
  // updatePrescriptions(@Args('updatePrescriptionsInput') updatePrescriptionsInput: UpdatePrescriptionsInput) {
  //   return this.prescriptionsService.update(updatePrescriptionsInput.id, updatePrescriptionsInput);
  // }

  // @Mutation(() => Prescriptions)
  // removePrescriptions(@Args('id', { type: () => Int }) id: number) {
  //   return this.prescriptionsService.remove(id);
  // }
}
