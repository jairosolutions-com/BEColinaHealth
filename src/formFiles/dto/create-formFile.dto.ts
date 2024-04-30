import { Field } from "@nestjs/graphql";

export class CreateFormFileDto {
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
