import { PartialType } from '@nestjs/mapped-types';
import { CreateAllergiesInput } from './create-allergies.dto';
import { Field } from '@nestjs/graphql';

export class UpdateAllergiesInput extends PartialType(CreateAllergiesInput) {

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
    createdAt: string;

    @Field()
    updatedAt: string;

    @Field()
    deletedAt: string;

}
