import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LabResultsService } from './lab_results.service';
import { LabResult } from './entities/lab_result.entity';
import { CreateLabResultInput } from './dto/create-lab_result.input';
import { UpdateLabResultInput } from './dto/update-lab_result.input';

@Resolver(() => LabResult)
export class LabResultsResolver {
  constructor(private readonly labResultsService: LabResultsService) {}

  @Mutation(() => LabResult)
  createLabResult(@Args('createLabResultInput') createLabResultInput: CreateLabResultInput) {
    return this.labResultsService.create(createLabResultInput);
  }

  @Query(() => [LabResult], { name: 'labResults' })
  findAll() {
    return this.labResultsService.findAll();
  }

  @Query(() => LabResult, { name: 'labResult' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.labResultsService.findOne(id);
  }

  @Mutation(() => LabResult)
  updateLabResult(@Args('updateLabResultInput') updateLabResultInput: UpdateLabResultInput) {
    return this.labResultsService.update(updateLabResultInput.id, updateLabResultInput);
  }

  @Mutation(() => LabResult)
  removeLabResult(@Args('id', { type: () => Int }) id: number) {
    return this.labResultsService.remove(id);
  }
}
