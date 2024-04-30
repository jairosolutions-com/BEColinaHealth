import { PartialType } from '@nestjs/mapped-types';
import { CreatePrescriptionsFileDto } from './create-prescriptionsFiles.dto';
import { Field } from '@nestjs/graphql';
export class UpdatePrescriptionsFileDto extends PartialType(CreatePrescriptionsFileDto) {     @Field()
    id: number;

    @Field()
    file_uuid: string;

    @Field()
    filename: string;

    @Field()
    labResultsId: string;

    @Field()
    data: Uint8Array;}
