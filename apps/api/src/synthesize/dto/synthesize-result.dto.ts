export interface SynthesizeResult {
  entries: Array<{
    topicId: number;
    topicName: string;
    confirmation: string;
  }>;
}
