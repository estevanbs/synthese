import { Injectable } from '@nestjs/common';
import { Ollama } from 'ollama';
import type { AiProcessor, AiProcessResult } from '@synthese/domain';
import { SYSTEM_PROMPT } from './prompts.js';

interface OllamaEntry {
  topicName: string;
  topicType: string;
  summary: string;
  confirmation: string;
}

interface OllamaResponse {
  entries: OllamaEntry[];
}

@Injectable()
export class OllamaAiProcessorService implements AiProcessor {
  private readonly client: Ollama;

  constructor() {
    const host = process.env['OLLAMA_HOST'];
    this.client = host ? new Ollama({ host }) : new Ollama();
  }

  async process(
    rawText: string,
    existingNotesByTopicName: Record<string, string>,
  ): Promise<AiProcessResult> {
    const existingNotesSection =
      Object.keys(existingNotesByTopicName).length > 0
        ? `\n\nExisting notes for known topics:\n${Object.entries(existingNotesByTopicName)
            .map(([name, note]) => `--- ${name} ---\n${note}`)
            .join('\n\n')}`
        : '';

    const userMessage = `User input:\n${rawText}${existingNotesSection}`;
    const model = process.env['OLLAMA_MODEL'] || 'llama3';

    const response = await this.client.chat({
      model,
      format: 'json',
      options: {
        temperature: 0.2, // Lower temperature to improve json structure and consistency
      },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    });

    const text = response.message.content;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI response did not contain valid JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]) as OllamaResponse;

    return {
      entries: parsed.entries.map((e) => ({
        topicName: e.topicName,
        summary: e.summary,
        confirmation: e.confirmation,
      })),
    };
  }
}
