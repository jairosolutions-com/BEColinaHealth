import { CreateNotesInput } from './create-notes.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNotesInput extends PartialType(CreateNotesInput) {
  subject: string;
  notes: string;
}
