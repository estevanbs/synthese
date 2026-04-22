import { ClaudeAiProcessorService } from './claude-ai-processor.service';

const mockCreate = jest.fn();
jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({ messages: { create: mockCreate } })),
}));

describe('ClaudeAiProcessorService', () => {
  let service: ClaudeAiProcessorService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env['ANTHROPIC_API_KEY'] = 'test-key';
    service = new ClaudeAiProcessorService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse a valid Claude response with one topic', async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            entries: [
              {
                topicName: 'Abracadabra',
                topicType: 'book',
                summary: 'Chapter 3: The monster killed the girl.',
                confirmation: "Added Chapter 3 notes to 'Abracadabra'",
              },
            ],
          }),
        },
      ],
    });

    const result = await service.process('Chapter 3 of book Abracadabra...', {});

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].topicName).toBe('Abracadabra');
    expect(result.entries[0].summary).toBe('Chapter 3: The monster killed the girl.');
    expect(result.entries[0].confirmation).toBe("Added Chapter 3 notes to 'Abracadabra'");
  });

  it('should include existing notes in the prompt when provided', async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({ entries: [{ topicName: 'Abracadabra', topicType: 'book', summary: 'Updated summary', confirmation: 'Saved' }] }),
        },
      ],
    });

    await service.process('new content', { Abracadabra: 'old summary' });

    const callArgs = mockCreate.mock.calls[0][0];
    const userMessage = callArgs.messages[0].content;
    expect(userMessage).toContain('old summary');
    expect(userMessage).toContain('Abracadabra');
  });

  it('should parse response with multiple topics', async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            entries: [
              { topicName: 'Breaking Bad', topicType: 'show', summary: 'Episode 3...', confirmation: 'Saved Breaking Bad' },
              { topicName: 'Dune', topicType: 'book', summary: 'Chapter 2...', confirmation: 'Saved Dune' },
            ],
          }),
        },
      ],
    });

    const result = await service.process('mixed input', {});

    expect(result.entries).toHaveLength(2);
    expect(result.entries[0].topicName).toBe('Breaking Bad');
    expect(result.entries[1].topicName).toBe('Dune');
  });

  it('should throw when response contains no JSON', async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'Sorry, I cannot process that.' }],
    });

    await expect(service.process('text', {})).rejects.toThrow(
      'AI response did not contain valid JSON',
    );
  });
});
