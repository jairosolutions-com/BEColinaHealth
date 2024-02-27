import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MedicalHistoryService } from './medical_history.service';
import { MedicalHistory } from './entities/medical_history.entity';
import { CreateMedicalHistoryInput } from './dto/create-medical_history.input';
import { UpdateMedicalHistoryInput } from './dto/update-medical_history.input';

@Resolver(() => MedicalHistory)
export class MedicalHistoryResolver {
  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  @Mutation(() => MedicalHistory)
  createMedicalHistory(@Args('createMedicalHistoryInput') createMedicalHistoryInput: CreateMedicalHistoryInput) {
    return this.medicalHistoryService.create(createMedicalHistoryInput);
  }

  @Query(() => [MedicalHistory], { name: 'medicalHistory' })
  findAll() {
    return this.medicalHistoryService.findAll();
  }

  @Query(() => MedicalHistory, { name: 'medicalHistory' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.medicalHistoryService.findOne(id);
  }

  @Mutation(() => MedicalHistory)
  updateMedicalHistory(@Args('updateMedicalHistoryInput') updateMedicalHistoryInput: UpdateMedicalHistoryInput) {
    return this.medicalHistoryService.update(updateMedicalHistoryInput.id, updateMedicalHistoryInput);
  }

  @Mutation(() => MedicalHistory)
  removeMedicalHistory(@Args('id', { type: () => Int }) id: number) {
    return this.medicalHistoryService.remove(id);
  }
}
