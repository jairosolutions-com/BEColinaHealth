import { Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

export class CreateAllergyInput {
    
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
    created_at: string;

    @Field()
    updated_at: string;

    @Field()
    deleted_at: string;

}
