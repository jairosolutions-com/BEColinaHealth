import { CreateCountryInput } from './create-countries.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCountryInput extends PartialType(CreateCountryInput) {
  @Field(() => Int)
  id: number;
}
