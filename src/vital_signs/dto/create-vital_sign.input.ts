import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVitalSignInput {
  @Field(() => Int)
  id: number;

  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  numDays: string;

  @Field()
  dosage: string;

  @Field()
  frequency: string;

  @Field()
  interval: string;

  @Field()
  maintenance: boolean;

  @Field(() => Int)
  patientId: number;

  @Field()
  updated_at: string;

  @Field({ nullable: true })
  created_at: string;

  @Field({ nullable: true })
  deleted_at: string;

}
