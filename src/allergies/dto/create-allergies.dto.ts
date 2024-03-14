import { Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

export class CreateAllergiesInput {

    @Field()
    id: number;

    @Field()
    uuid: string;

    @IsNotEmpty()
    @Field()
    type: string;

    @IsNotEmpty()
    @Field()
    allergen: string;

    @Field()
    severity: string;

    @Field()
    reaction: string;

    @Field()
    notes: string;

    @IsNotEmpty()
    @Field()
    patientId: number;

    @Field()
    createdAt: string;

    @Field()
    updatedAt: string;

    @Field()
    deletedAt: string;

}
