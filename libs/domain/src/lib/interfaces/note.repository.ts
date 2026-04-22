import type { Note } from './note.interface.js';

export interface NoteRepository {
  create(content: string, topicId: number): Promise<Note>;
  findLatestByTopicId(topicId: number): Promise<Note | null>;
}
