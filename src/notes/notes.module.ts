import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
// import { NotesResolver } from './notes.resolver';
import { NotesController } from './notes.controller';
import { Patients } from 'src/patients/entities/patients.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notes } from './entities/notes.entity';
import { PatientsService } from 'src/patients/patients.service';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notes, Patients])],
  providers: [NotesService, PatientsService, IdService],

  controllers: [NotesController],
})
export class NotesModule {}
