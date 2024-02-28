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
  findAll() {
    return this.patientInformationService.findAll();
  }

  @Query(() => PatientInformation, { name: 'patientInformation' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.patientInformationService.findOne(id);
  }

  @Mutation(() => PatientInformation)
  updatePatientInformation(
    @Args('updatePatientInformationInput')
    updatePatientInformationInput: UpdatePatientInformationInput,
  ) {
    return this.patientInformationService.update(
      updatePatientInformationInput.id,
      updatePatientInformationInput,
    );
  }

  @Mutation(() => PatientInformation)
  removePatientInformation(@Args('id', { type: () => Int }) id: number) {
    return this.patientInformationService.remove(id);
  }
}
