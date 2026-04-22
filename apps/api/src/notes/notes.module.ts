import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller.js';
import { NoteService } from './note.service.js';

@Module({
  controllers: [NotesController],
  providers: [NoteService],
})
export class NotesModule {}
