import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEmergencyContactsInput {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  phoneNumber: string;

  @Field()
  patientRelationship: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  zip: string;

  @Field()
  country: string;

  @Field()
  patientId: number;

  @Field()
  updatedAt: string;

  @Field()
  createdAt: string;

  @Field()
  deletedAt: string;
}
