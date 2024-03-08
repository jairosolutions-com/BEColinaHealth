import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Patients } from './entities/patients.entity';
import { CreatePatientsInput } from './dto/create-patients.input';
import { UpdatePatientsInput } from './dto/update-patients.input';

@Resolver(() => Patients)
export class PatientsResolver {
  // constructor(
  //   private readonly patientsService: PatientsService,
  // ) { }

  // @Mutation(() => Patients)
  // createPatients(
  //   @Args('createPatientsInput')
  //   createPatientsInput: CreatePatientsInput,
  // ) {
  //   return this.patientsService.createPatients(
  //     createPatientsInput,
  //   );
  // }

  // @Query(() => [Patients], { name: 'patients' })
  // getAllPatients() {
  //   return this.patientsService.getAllPatientsFullInfo();
  // }

  // @Query(() => Patients, { name: 'patients' })
  // searchAllPatientInfoByTerm(@Args('id', { type: () => Int }) id: number) {
  //   return this.patientsService.searchAllPatientInfoByTerm(i(term, page);
  // }

  @Mutation(() => Patients)
  updatePatients(@Args('updatePatientsInput') updatePatientsInput: UpdatePatientsInput) {
  }

  // @Mutation(() => Patients)
  // removePatients(@Args('id', { type: () => Int }) id: number) {
  //   return this.patientsService.softDeletePatient(id);
  // }
}
