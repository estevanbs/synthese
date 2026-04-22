export interface TopicEntry {
  topicName: string;
  summary: string;
  confirmation: string;
}

export interface AiProcessResult {
  entries: TopicEntry[];
}

export interface AiProcessor {
  process(
    rawText: string,
    existingNotesByTopicName: Record<string, string>,
  ): Promise<AiProcessResult>;
}
