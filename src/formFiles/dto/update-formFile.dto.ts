import { PartialType } from '@nestjs/mapped-types';
import { CreateFormFileDto } from './create-formFile.dto';
import { Field } from '@nestjs/graphql';

export class UpdateFormFileDto extends PartialType(CreateFormFileDto) {
    @Field()
    id: number;

    @Field()
    file_uuid: string;

    @Field()
    filename: string;

    @Field()
    labResultsId: string;

    @Field()
    data: Uint8Array;
}
