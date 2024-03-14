import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MedicationLogsService } from './medicationLogs.service';
import { MedicationLogs } from './entities/medicationLogs.entity';
import { CreateMedicationLogsInput } from './dto/create-medicationLogs.input';
import { UpdateMedicationLogsInput } from './dto/update-medicationLogs.input';

@Resolver(() => MedicationLogs)
export class MedicationLogsResolver {
  // constructor(private readonly medicationLogsService: MedicationLogsService) {}

  // @Mutation(() => MedicationLogs)
  // createMedicationLogs(@Args('createMedicationLogsInput') createMedicationLogsInput: CreateMedicationLogsInput) {
  //   return this.medicationLogsService.create(createMedicationLogsInput);
  // }

  // @Query(() => [MedicationLogs], { name: 'medicationLogs' })
  // findAll() {
  //   return this.medicationLogsService.findAll();
  // }

  // @Query(() => MedicationLogs, { name: 'medicationLogs' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.medicationLogsService.findOne(id);
  // }

  // @Mutation(() => MedicationLogs)
  // updateMedicationLogs(@Args('updateMedicationLogsInput') updateMedicationLogsInput: UpdateMedicationLogsInput) {
  //   return this.medicationLogsService.update(updateMedicationLogsInput.id, updateMedicationLogsInput);
  // }

  // @Mutation(() => MedicationLogs)
  // removeMedicationLogs(@Args('id', { type: () => Int }) id: number) {
  //   return this.medicationLogsService.remove(id);
  // }
}
