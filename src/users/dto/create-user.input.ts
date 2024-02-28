import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  uuid: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  fName: string;

  @Field()
  lName: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  updated_at: string;

  @Field({ nullable: true })
  created_at: string;

  @Field({ nullable: true })
  deleted_at: string;
}
