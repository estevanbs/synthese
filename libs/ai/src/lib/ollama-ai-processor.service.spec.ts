import { OllamaAiProcessorService } from './ollama-ai-processor.service';
import { SYSTEM_PROMPT } from './prompts';
import { Ollama } from 'ollama';

jest.mock('ollama', () => ({
  Ollama: jest.fn(),
}));

describe('OllamaAiProcessorService', () => {
  const originalEnv = process.env;
  const MockedOllama = Ollama as jest.Mock;
  let mockChat: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockChat = jest.fn();
    MockedOllama.mockImplementation(() => ({ chat: mockChat }));
    process.env = { ...originalEnv };
    delete process.env['OLLAMA_HOST'];
    delete process.env['OLLAMA_MODEL'];
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('should create the client without host when OLLAMA_HOST is not set', () => {
    const service = new OllamaAiProcessorService();

    expect(service).toBeDefined();
    expect(MockedOllama).toHaveBeenCalledWith();
  });

  it('should create the client with host when OLLAMA_HOST is set', () => {
    process.env['OLLAMA_HOST'] = 'http://localhost:11434';

    new OllamaAiProcessorService();

    expect(MockedOllama).toHaveBeenCalledWith({ host: 'http://localhost:11434' });
  });

  it('should parse a valid Ollama response with one topic', async () => {
    mockChat.mockResolvedValue({
      message: {
        content: JSON.stringify({
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
    });

    const service = new OllamaAiProcessorService();
    const result = await service.process('Chapter 3 of book Abracadabra...', {});

    expect(result.entries).toEqual([
      {
        topicName: 'Abracadabra',
        summary: 'Chapter 3: The monster killed the girl.',
        confirmation: "Added Chapter 3 notes to 'Abracadabra'",
      },
    ]);
  });

  it('should send the default model, json format, prompt, and user message', async () => {
    mockChat.mockResolvedValue({
      message: { content: JSON.stringify({ entries: [] }) },
    });

    const service = new OllamaAiProcessorService();
    await service.process('new content', { Abracadabra: 'old summary' });

    expect(mockChat).toHaveBeenCalledWith({
      model: 'llama3',
      format: 'json',
      options: { temperature: 0.2 },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content:
            'User input:\nnew content\n\nExisting notes for known topics:\n--- Abracadabra ---\nold summary',
        },
      ],
    });
  });

  it('should use OLLAMA_MODEL when provided', async () => {
    process.env['OLLAMA_MODEL'] = 'mistral';
    mockChat.mockResolvedValue({
      message: { content: JSON.stringify({ entries: [] }) },
    });

    const service = new OllamaAiProcessorService();
    await service.process('notes', {});

    expect(mockChat.mock.calls[0][0].model).toBe('mistral');
  });

  it('should parse JSON embedded in surrounding text', async () => {
    mockChat.mockResolvedValue({
      message: {
        content: `Here is the result:
        ${JSON.stringify({
          entries: [
            {
              topicName: 'Dune',
              topicType: 'book',
              summary: 'Chapter 2...',
              confirmation: 'Saved Dune',
            },
          ],
        })}`,
      },
    });

    const service = new OllamaAiProcessorService();
    const result = await service.process('mixed input', {});

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].topicName).toBe('Dune');
  });

  it('should throw when response contains no JSON', async () => {
    mockChat.mockResolvedValue({
      message: { content: 'Sorry, I cannot process that.' },
    });

    const service = new OllamaAiProcessorService();

    await expect(service.process('text', {})).rejects.toThrow(
      'AI response did not contain valid JSON',
    );
  });
});
