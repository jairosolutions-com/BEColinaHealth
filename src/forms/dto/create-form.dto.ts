import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFormDto {
    @Field()
    id: number;
  
    @Field()
    uuid: string;
  
    @Field()
    nameOfDocument: string;
  
    @Field()
    dateIssued: string;
  
    @Field()
    notes: string;

    isArchived: boolean;
  
}
