import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PatientInformationService } from './patient_information.service';
import { PatientInformation } from './entities/patient_information.entity';
import { CreatePatientInformationInput } from './dto/create-patient_information.input';
import { UpdatePatientInformationInput } from './dto/update-patient_information.input';

@Resolver(() => PatientInformation)
export class PatientInformationResolver {
  constructor(
    private readonly patientInformationService: PatientInformationService,
  ) {}

  @Mutation(() => PatientInformation)
  createPatientInformation(
    @Args('createPatientInformationInput')
    createPatientInformationInput: CreatePatientInformationInput,
  ) {
    return this.patientInformationService.createPatientInformation(
      createPatientInformationInput,
    );
  }

  @Query(() => [PatientInformation], { name: 'patientInformation' })
  getAllPatients() {
    return this.patientInformationService.getAllPatients();
  }

  @Query(() => PatientInformation, { name: 'patientInformation' })
  getPatientInformationById(@Args('id', { type: () => Int }) id: number) {
    return this.patientInformationService.getPatientInformationById(id);
  }

  @Mutation(() => PatientInformation)
  updatePatientInformation(@Args('updatePatientInformationInput') updatePatientInformationInput: UpdatePatientInformationInput) {
  }

  @Mutation(() => PatientInformation)
  removePatientInformation(@Args('id', { type: () => Int }) id: number) {
    return this.patientInformationService.removePatientInformation(id);
  }
}
