import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LabResultsService } from './labResults.service';
import { LabResults } from './entities/labResults.entity';


@Resolver(() => LabResults)
export class LabResultsResolver {
  constructor(private readonly labResultsService: LabResultsService) { }

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

  // @Query(() => LabResults, { name: 'labResults' })
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
