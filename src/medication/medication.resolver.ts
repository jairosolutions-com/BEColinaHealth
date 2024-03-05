import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MedicationService } from './medication.service';
import { Medication } from './entities/medication.entity';
import { CreateMedicationInput } from './dto/create-medication.input';
import { UpdateMedicationInput } from './dto/update-medication.input';

@Resolver(() => Medication)
export class MedicationResolver {
  // constructor(private readonly medicationService: MedicationService) {}

  // @Mutation(() => Medication)
  // createMedication(@Args('createMedicationInput') createMedicationInput: CreateMedicationInput) {
  //   return this.medicationService.create(createMedicationInput);
  // }

  // @Query(() => [Medication], { name: 'medication' })
  // findAll() {
  //   return this.medicationService.findAll();
  // }

  // @Query(() => Medication, { name: 'medication' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.medicationService.findOne(id);
  // }

  // @Mutation(() => Medication)
  // updateMedication(@Args('updateMedicationInput') updateMedicationInput: UpdateMedicationInput) {
  //   return this.medicationService.update(updateMedicationInput.id, updateMedicationInput);
  // }

  // @Mutation(() => Medication)
  // removeMedication(@Args('id', { type: () => Int }) id: number) {
  //   return this.medicationService.remove(id);
  // }
}
