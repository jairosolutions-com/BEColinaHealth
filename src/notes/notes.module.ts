import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesResolver } from './notes.resolver';
import { NotesController } from './notes.controller';

@Module({
  providers: [NotesResolver, NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
