import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotesService } from './notes.service';
import { Notes } from './entities/note.entity';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateNoteInput } from './dto/update-note.input';

@Resolver(() => Notes)
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  @Mutation(() => Notes)
  createNote(@Args('createNoteInput') createNoteInput: CreateNoteInput) {
    return this.notesService.create(createNoteInput);
  }

  @Query(() => [Notes], { name: 'notes' })
  findAll() {
    return this.notesService.findAll();
  }

  @Query(() => Notes, { name: 'note' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.notesService.findOne(id);
  }

  @Mutation(() => Notes)
  updateNote(@Args('updateNoteInput') updateNoteInput: UpdateNoteInput) {
    return this.notesService.update(updateNoteInput.id, updateNoteInput);
  }

  @Mutation(() => Notes)
  removeNote(@Args('id', { type: () => Int }) id: number) {
    return this.notesService.remove(id);
  }
}
