// import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// import { NotesService } from './notes.service';
// import { Notes } from './entities/notes.entity';
// import { CreateNotesInput } from './dto/create-notes.input';
// import { UpdateNotesInput } from './dto/update-notes.input';

// @Resolver(() => Notes)
// export class NotesResolver {
//   constructor(private readonly notesService: NotesService) { }

// @Mutation(() => Notes)
// createNotes(@Args('createNotesInput') createNotesInput: CreateNotesInput) {
//   return this.notesService.create(createNotesInput);
// }

// @Query(() => [Notes], { name: 'notes' })
// findAll() {
//   return this.notesService.findAll();
// }

// @Query(() => Notes, { name: 'notes' })
// findOne(@Args('id', { type: () => Int }) id: number) {
//   return this.notesService.findOne(id);
// }

  // @Mutation(() => Notes)
  // updateNotes(@Args('updateNotesInput') updateNotesInput: UpdateNotesInput) {
  //   return this.notesService.update(updateNotesInput.id, updateNotesInput);
  // }

  // @Mutation(() => Notes)
  // removeNotes(@Args('id', { type: () => Int }) id: number) {
  //   return this.notesService.remove(id);
  // }


// @Mutation(() => Notes)
// removeNotes(@Args('id', { type: () => Int }) id: number) {
//   return this.notesService.remove(id);
// }
