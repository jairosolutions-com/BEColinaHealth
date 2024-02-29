import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PrescriptionService } from './prescription.service';
import { Prescription } from './entities/prescription.entity';
import { CreatePrescriptionInput } from './dto/create-prescription.input';
import { UpdatePrescriptionInput } from './dto/update-prescription.input';

@Resolver(() => Prescription)
export class PrescriptionResolver {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Mutation(() => Prescription)
  createPrescription(@Args('createPrescriptionInput') createPrescriptionInput: CreatePrescriptionInput) {
    return this.prescriptionService.create(createPrescriptionInput);
  }

  @Query(() => [Prescription], { name: 'prescription' })
  findAll() {
    return this.prescriptionService.findAll();
  }

  @Query(() => Prescription, { name: 'prescription' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.prescriptionService.findOne(id);
  }

  @Mutation(() => Prescription)
  updatePrescription(@Args('updatePrescriptionInput') updatePrescriptionInput: UpdatePrescriptionInput) {
    return this.prescriptionService.update(updatePrescriptionInput.id, updatePrescriptionInput);
  }

  @Mutation(() => Prescription)
  removePrescription(@Args('id', { type: () => Int }) id: number) {
    return this.prescriptionService.remove(id);
  }
}
