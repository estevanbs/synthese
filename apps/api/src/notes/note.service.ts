import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { NoteRepository, Note } from '@synthese/domain';
import { NOTE_REPOSITORY } from '@synthese/domain';

@Injectable()
export class NoteService {
  constructor(
    @Inject(NOTE_REPOSITORY)
    private readonly noteRepository: NoteRepository,
  ) {}

  async findLatestByTopicId(topicId: number): Promise<Note> {
    const note = await this.noteRepository.findLatestByTopicId(topicId);
    if (!note) {
      throw new NotFoundException(`No note found for topic ${topicId}`);
    }
    return note;
  }
}
