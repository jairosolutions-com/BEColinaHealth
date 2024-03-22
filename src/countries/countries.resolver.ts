// import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// import { CountryService } from './countries.service';
// import { Countries } from './entities/countries.entity';
// import { CreateCountryInput } from './dto/create-countries.input';
// import { UpdateCountryInput } from './dto/update-countries.input';

// @Resolver(() => Countries)
// export class CountryResolver {
//   constructor(private readonly countriesService: CountryService) { }

// @Mutation(() => Countries)
// createCountry(@Args('createCountryInput') createCountryInput: CreateCountryInput) {
//   return this.countriesService.create(createCountryInput);
// }

// // @Query(() => [Countries], { name: 'countries' })
// // findAll() {
// //   return this.countriesService.findAll();
// // }

// @Query(() => Countries, { name: 'countries' })
// findOne(@Args('id', { type: () => Int }) id: number) {
//   return this.countriesService.findOne(id);
// }

  // @Mutation(() => Countries)
  // updateCountry(@Args('updateCountryInput') updateCountryInput: UpdateCountryInput) {
  //   return this.countriesService.update(updateCountryInput.id, updateCountryInput);
  // }

  // @Mutation(() => Countries)
  // removeCountry(@Args('id', { type: () => Int }) id: number) {
  //   return this.countriesService.remove(id);
  // }


// @Mutation(() => Countries)
// removeCountry(@Args('id', { type: () => Int }) id: number) {
//   return this.countriesService.remove(id);
// }
