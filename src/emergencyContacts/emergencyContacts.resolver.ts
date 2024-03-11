import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmergencyContactsService } from './emergencyContacts.service';
import { EmergencyContacts } from './entities/emergencyContacts.entity';
import { CreateEmergencyContactsInput } from './dto/create-emergencyContacts.input';
import { UpdateEmergencyContactsInput } from './dto/update-emergencyContacts.input';

@Resolver(() => EmergencyContacts)
export class EmergencyContactsResolver {
  // constructor(private readonly emergencyContactService: EmergencyContactsService) { }

  // @Mutation(() => EmergencyContacts)
  // createEmergencyContacts(@Args('createEmergencyContactsInput') createEmergencyContactsInput: CreateEmergencyContactsInput) {
  //   return this.emergencyContactService.create(createEmergencyContactsInput);
  // }

  // @Query(() => [EmergencyContacts], { name: 'emergencyContact' })
  // findAll() {
  //   return this.emergencyContactService.findAll();
  // }

  // @Query(() => EmergencyContacts, { name: 'emergencyContact' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.emergencyContactService.findOne(id);
  // }

  // @Mutation(() => EmergencyContacts)
  // updateEmergencyContacts(@Args('updateEmergencyContactsInput') updateEmergencyContactsInput: UpdateEmergencyContactsInput) {
  //   return this.emergencyContactService.update(updateEmergencyContactsInput.id, updateEmergencyContactsInput);
  // }

  // @Mutation(() => EmergencyContacts)
  // removeEmergencyContacts(@Args('id', { type: () => Int }) id: number) {
  //   return this.emergencyContactService.remove(id);
  // }
}
