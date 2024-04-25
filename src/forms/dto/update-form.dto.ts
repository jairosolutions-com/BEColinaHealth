import { PartialType } from '@nestjs/mapped-types';
import { CreateFormDto } from './create-form.dto';
import { Field } from '@nestjs/graphql';

export class UpdateFormDto extends PartialType(CreateFormDto) {

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


}
