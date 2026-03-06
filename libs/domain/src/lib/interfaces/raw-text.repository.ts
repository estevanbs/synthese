import type { RawText } from './raw-text.interface.js';

export interface RawTextRepository {
  create(content: string, topicId: number): Promise<RawText>;
}
