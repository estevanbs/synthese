import type { Note } from './note.interface.js';

export interface NoteRepository {
  create(content: string, topicId: number): Promise<Note>;
  findById(id: number): Promise<Note | null>;
  findLatestByTopicId(topicId: number): Promise<Note | null>;
  update(id: number, content: string): Promise<Note>;
}
