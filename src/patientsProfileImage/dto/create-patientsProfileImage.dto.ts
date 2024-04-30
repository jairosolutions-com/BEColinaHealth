import { Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePatientsProfileImageFileDto {
    @Field()
    id: number;

    @Field()
    img_uuid: string;

    @Field()
    filename: string;

    @Field()
    patientId: string;

    @Field()
    data: Uint8Array;

}
