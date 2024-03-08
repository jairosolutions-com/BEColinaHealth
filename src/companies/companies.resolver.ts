// import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// import { CompaniesService } from './companies.service';
// import { Companies } from './entities/companies.entity';
// import { CreateCompaniesInput } from './dto/create-companies.input';
// import { UpdateCompaniesInput } from './dto/update-companies.input';

// @Resolver(() => Companies)
// export class CompaniesResolver {
//   constructor(private readonly companyService: CompaniesService) {}

//   @Mutation(() => Companies)
//   createCompanies(@Args('createCompaniesInput') createCompaniesInput: CreateCompaniesInput) {
//     return this.companyService.create(createCompaniesInput);
//   }

//   @Query(() => [Companies], { name: 'companies' })
//   findAll() {
//     return this.companyService.findAll();
//   }

//   @Query(() => Companies, { name: 'companies' })
//   findOne(@Args('id', { type: () => Int }) id: number) {
//     return this.companyService.findOne(id);
//   }

//   @Mutation(() => Companies)
//   updateCompanies(@Args('updateCompaniesInput') updateCompaniesInput: UpdateCompaniesInput) {
//     return this.companyService.update(updateCompaniesInput.id, updateCompaniesInput);
//   }

//   @Mutation(() => Companies)
//   removeCompanies(@Args('id', { type: () => Int }) id: number) {
//     return this.companyService.remove(id);
//   }
// }
