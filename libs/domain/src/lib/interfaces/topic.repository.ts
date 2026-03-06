import type { Topic } from './topic.interface.js';

export interface TopicRepository {
  create(name: string): Promise<Topic>;
  findById(id: number): Promise<Topic | null>;
  findAll(): Promise<Topic[]>;
}
