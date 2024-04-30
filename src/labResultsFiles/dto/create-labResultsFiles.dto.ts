import { Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLabResultsFileDto {
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
