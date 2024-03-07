import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllergyService } from './allergy.service';
import { CreateAllergyInput } from './dto/create-allergy.dto';
import { UpdateAllergyInput } from './dto/update-allergy.dto';

@Controller('allergy')
export class AllergyController {
  constructor(private readonly allergyService: AllergyService) {}
  
}