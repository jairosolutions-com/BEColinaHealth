import { CreateLabResultInput } from './create-lab_result.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLabResultInput extends PartialType(CreateLabResultInput) {
  @Field(() => Int)
  id: number;
}
