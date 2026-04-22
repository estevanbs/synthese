import { Injectable, Inject } from '@nestjs/common';
import type { TopicRepository, NoteRepository, AiProcessor } from '@synthese/domain';
import { TOPIC_REPOSITORY, NOTE_REPOSITORY, AI_PROCESSOR } from '@synthese/domain';
import type { SynthesizeResult } from './dto/synthesize-result.dto.js';

@Injectable()
export class SynthesizeService {
  constructor(
    @Inject(TOPIC_REPOSITORY)
    private readonly topicRepository: TopicRepository,
    @Inject(NOTE_REPOSITORY)
    private readonly noteRepository: NoteRepository,
    @Inject(AI_PROCESSOR)
    private readonly aiProcessor: AiProcessor,
  ) {}

  async process(rawText: string): Promise<SynthesizeResult> {
    const allTopics = await this.topicRepository.findAll();
    const existingNotesByTopicName: Record<string, string> = {};

    for (const topic of allTopics) {
      const latestNote = await this.noteRepository.findLatestByTopicId(topic.id);
      if (latestNote) {
        existingNotesByTopicName[topic.name] = latestNote.content;
      }
    }

    const aiResult = await this.aiProcessor.process(rawText, existingNotesByTopicName);

    const results: SynthesizeResult['entries'] = [];

    for (const entry of aiResult.entries) {
      const topic = await this.topicRepository.findOrCreate(entry.topicName);
      await this.noteRepository.create(entry.summary, topic.id);
      results.push({
        topicId: topic.id,
        topicName: topic.name,
        confirmation: entry.confirmation,
      });
    }

    return { entries: results };
  }
}
