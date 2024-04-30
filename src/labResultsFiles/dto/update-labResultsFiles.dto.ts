import { PartialType } from '@nestjs/mapped-types';
import { CreateLabResultsFileDto } from './create-labResultsFiles.dto';
import { Field } from '@nestjs/graphql';

export class UpdateLabResultsFileDto extends PartialType(CreateLabResultsFileDto) {
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
