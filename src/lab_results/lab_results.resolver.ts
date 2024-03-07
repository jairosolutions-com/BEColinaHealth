import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LabResultsService } from './lab_results.service';
import { LabResults } from './entities/lab_result.entity';
import { CreateLabResultInput } from './dto/create-lab_result.input';
import { UpdateLabResultInput } from './dto/update-lab_result.input';

@Resolver(() => LabResults)
export class LabResultsResolver {
  constructor(private readonly labResultsService: LabResultsService) {}

  // @Mutation(() => LabResults)
  // createLabResult(
  //   @Args('createLabResultInput') createLabResultInput: CreateLabResultInput,
  // ) {
  //   return this.labResultsService.create(createLabResultInput);
  // }

  // @Query(() => [LabResults], { name: 'labResults' })
  // findAll() {
  //   return this.labResultsService.findAll();
  // }

  // @Query(() => LabResults, { name: 'labResult' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.labResultsService.findOne(id);
  // }

  // @Mutation(() => LabResults)
  // updateLabResult(
  //   @Args('updateLabResultInput') updateLabResultInput: UpdateLabResultInput,
  // ) {
  //   return this.labResultsService.update(
  //     updateLabResultInput.id,
  //     updateLabResultInput,
  //   );
  // }

  // @Mutation(() => LabResults)
  // removeLabResult(@Args('id', { type: () => Int }) id: number) {
  //   return this.labResultsService.remove(id);
  // }
}
