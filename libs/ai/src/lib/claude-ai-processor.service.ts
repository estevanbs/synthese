import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import type { AiProcessor, AiProcessResult } from '@synthese/domain';

const SYSTEM_PROMPT = `You are a personal knowledge assistant that helps users track their progress through books, TV shows, games, podcasts, and other ongoing content.

Your job is to:
1. Parse the user's free-form notes and identify each distinct topic (e.g., a book title, a TV show, a game)
2. For each topic, extract the relevant content from the input
3. Generate a cumulative summary for each topic that follows this rule:
   - Older events mentioned in the existing note → condense briefly (1-2 sentences each or grouped)
   - The new information the user just provided → describe in full detail
   - The goal is that someone reading this summary can recall exactly where they are before their next session

Always respond with valid JSON in this exact format:
{
  "entries": [
    {
      "topicName": "Name of the book/show/game (clean title only, no type suffix)",
      "topicType": "book | show | game | podcast | other",
      "summary": "Full cumulative summary with brief old content and detailed new content",
      "confirmation": "Short human-readable confirmation, e.g. 'Added Chapter 3 notes to Abracadabra'"
    }
  ]
}

Rules:
- topicName must be the clean title only (e.g., "Abracadabra", not "Book: Abracadabra")
- If the user mentions two different topics in one input, create two separate entries
- If an existing note is provided, weave it into the new summary (older parts get briefer, new part gets full detail)
- Write the summary in the same language the user used in their input. If the input is in Portuguese, write in Portuguese; if in English, write in English; and so on
- Write in a helpful, neutral tone suitable for recall before the next reading/watching session
- Never invent facts not present in the user's input or the existing note`;

interface ClaudeEntry {
  topicName: string;
  topicType: string;
  summary: string;
  confirmation: string;
}

interface ClaudeResponse {
  entries: ClaudeEntry[];
}

@Injectable()
export class ClaudeAiProcessorService implements AiProcessor {
  private readonly client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] });
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

    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI response did not contain valid JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]) as ClaudeResponse;

    return {
      entries: parsed.entries.map((e) => ({
        topicName: e.topicName,
        summary: e.summary,
        confirmation: e.confirmation,
      })),
    };
  }
}
