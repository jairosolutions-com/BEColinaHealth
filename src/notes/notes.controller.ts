import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNotesInput } from './dto/create-notes.input';
import { UpdateNotesInput } from './dto/update-notes.input';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    @Post(':id')
    createVitalSign(@Param('id') patientId: string,
        @Body() createNotesInput: CreateNotesInput) {
        return this.notesService.createNote(patientId,createNotesInput);
    }

    @Post('list/:id')
    findAllPatientNotes(
        @Param('id') patientId: string,
        @Body() body: { term: string, page: number, sortBy: string, sortOrder: 'ASC' | 'DESC' }
    ) {
        const { term = "", page, sortBy, sortOrder } = body;
        return this.notesService.getAllNotesByPatient(patientId, term, page, sortBy, sortOrder);
    }

    @Patch('update/:id')
    updateNotes(@Param('id') id: string, @Body() updateNotesInput: UpdateNotesInput) {
        return this.notesService.updateNote(id, updateNotesInput);
    }

    @Patch('delete/:id')
    softDeleteNote(@Param('id') id: string) {
        return this.notesService.softDeleteNotes(id);
    }
 }
