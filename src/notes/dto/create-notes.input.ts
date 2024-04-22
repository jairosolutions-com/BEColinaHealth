import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateNotesInput {
  uuid: string;
  subject: string;
  notes: string;
  type: string;
}
