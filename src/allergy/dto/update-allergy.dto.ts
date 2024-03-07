import { PartialType } from '@nestjs/mapped-types';
import { CreateAllergyInput } from './create-allergy.dto';
import { Field } from '@nestjs/graphql';

export class UpdateAllergyInput extends PartialType(CreateAllergyInput) {

    @Field()
    id: number;

    @Field()
    uuid: string;

    @Field()
    type: string;

    @Field()
    allergen: string;

    @Field()
    severity: string;

    @Field()
    reaction: string;

    @Field()
    notes: string;

    @Field()
    patientId: number;

    @Field()
    created_at: string;

    @Field()
    updated_at: string;

    @Field()
    deleted_at: string;

}
