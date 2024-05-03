import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientsProfileImageFileDto } from './create-patientsProfileImage.dto';
import { Field } from '@nestjs/graphql';
export class UpdatePatientsProfileImageFileDto extends PartialType(CreatePatientsProfileImageFileDto) {     @Field()
    id: number;

    @Field()
    img_uuid: string;

    @Field()
    filename: string;

    @Field()
    patientId: string;

    @Field()
    data: Uint8Array;}
