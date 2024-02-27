import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmergencyContactService } from './emergency_contact.service';
import { EmergencyContact } from './entities/emergency_contact.entity';
import { CreateEmergencyContactInput } from './dto/create-emergency_contact.input';
import { UpdateEmergencyContactInput } from './dto/update-emergency_contact.input';

@Resolver(() => EmergencyContact)
export class EmergencyContactResolver {
  constructor(private readonly emergencyContactService: EmergencyContactService) {}

  @Mutation(() => EmergencyContact)
  createEmergencyContact(@Args('createEmergencyContactInput') createEmergencyContactInput: CreateEmergencyContactInput) {
    return this.emergencyContactService.create(createEmergencyContactInput);
  }

  @Query(() => [EmergencyContact], { name: 'emergencyContact' })
  findAll() {
    return this.emergencyContactService.findAll();
  }

  @Query(() => EmergencyContact, { name: 'emergencyContact' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.emergencyContactService.findOne(id);
  }

  @Mutation(() => EmergencyContact)
  updateEmergencyContact(@Args('updateEmergencyContactInput') updateEmergencyContactInput: UpdateEmergencyContactInput) {
    return this.emergencyContactService.update(updateEmergencyContactInput.id, updateEmergencyContactInput);
  }

  @Mutation(() => EmergencyContact)
  removeEmergencyContact(@Args('id', { type: () => Int }) id: number) {
    return this.emergencyContactService.remove(id);
  }
}
