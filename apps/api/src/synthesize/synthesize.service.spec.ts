import { Test, TestingModule } from '@nestjs/testing';
import { SynthesizeService } from './synthesize.service';
import {
  TOPIC_REPOSITORY,
  NOTE_REPOSITORY,
  AI_PROCESSOR,
} from '@synthese/domain';

describe('SynthesizeService', () => {
  let service: SynthesizeService;

  const mockTopicRepository = {
    findAll: jest.fn(),
    findOrCreate: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockNoteRepository = {
    create: jest.fn(),
    findLatestByTopicId: jest.fn(),
  };

  const mockAiProcessor = {
    process: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SynthesizeService,
        { provide: TOPIC_REPOSITORY, useValue: mockTopicRepository },
        { provide: NOTE_REPOSITORY, useValue: mockNoteRepository },
        { provide: AI_PROCESSOR, useValue: mockAiProcessor },
      ],
    }).compile();

    service = module.get<SynthesizeService>(SynthesizeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('process', () => {
    it('should find or create topics and save AI-generated notes', async () => {
      const rawText = 'Chapter 3 of book Abracadabra. The monster killed the girl.';

      mockTopicRepository.findAll.mockResolvedValue([]);
      mockAiProcessor.process.mockResolvedValue({
        entries: [
          {
            topicName: 'Abracadabra',
            summary: 'Chapter 3: The monster killed the girl...',
            confirmation: "Added Chapter 3 notes to 'Abracadabra'",
          },
        ],
      });
      mockTopicRepository.findOrCreate.mockResolvedValue({ id: 1, name: 'Abracadabra' });
      mockNoteRepository.create.mockResolvedValue({
        id: 1,
        content: 'Chapter 3: The monster killed the girl...',
        topicId: 1,
        createdAt: new Date(),
      });

      const result = await service.process(rawText);

      expect(mockAiProcessor.process).toHaveBeenCalledWith(rawText, {});
      expect(mockTopicRepository.findOrCreate).toHaveBeenCalledWith('Abracadabra');
      expect(mockNoteRepository.create).toHaveBeenCalledWith(
        'Chapter 3: The monster killed the girl...',
        1,
      );
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0]).toMatchObject({
        topicId: 1,
        topicName: 'Abracadabra',
        confirmation: "Added Chapter 3 notes to 'Abracadabra'",
      });
    });

    it('should pass existing notes to AI when topics already have notes', async () => {
      const rawText = 'Chapter 4 of book Abracadabra. The police found clues.';

      mockTopicRepository.findAll.mockResolvedValue([{ id: 1, name: 'Abracadabra' }]);
      mockNoteRepository.findLatestByTopicId.mockResolvedValue({
        id: 1,
        content: 'Chapter 3: The monster killed the girl.',
        topicId: 1,
        createdAt: new Date(),
      });
      mockAiProcessor.process.mockResolvedValue({
        entries: [
          {
            topicName: 'Abracadabra',
            summary: 'Brief: Chapter 3 recap. Chapter 4: The police found clues...',
            confirmation: "Added Chapter 4 notes to 'Abracadabra'",
          },
        ],
      });
      mockTopicRepository.findOrCreate.mockResolvedValue({ id: 1, name: 'Abracadabra' });
      mockNoteRepository.create.mockResolvedValue({
        id: 2,
        content: 'Brief: Chapter 3 recap. Chapter 4: The police found clues...',
        topicId: 1,
        createdAt: new Date(),
      });

      await service.process(rawText);

      expect(mockAiProcessor.process).toHaveBeenCalledWith(rawText, {
        Abracadabra: 'Chapter 3: The monster killed the girl.',
      });
    });

    it('should handle multiple topics in a single input', async () => {
      const rawText = 'Watched ep 3 of Breaking Bad and read chapter 2 of Dune.';

      mockTopicRepository.findAll.mockResolvedValue([]);
      mockAiProcessor.process.mockResolvedValue({
        entries: [
          {
            topicName: 'Breaking Bad',
            summary: 'Episode 3: ...',
            confirmation: "Added Episode 3 notes to 'Breaking Bad'",
          },
          {
            topicName: 'Dune',
            summary: 'Chapter 2: ...',
            confirmation: "Added Chapter 2 notes to 'Dune'",
          },
        ],
      });
      mockTopicRepository.findOrCreate
        .mockResolvedValueOnce({ id: 1, name: 'Breaking Bad' })
        .mockResolvedValueOnce({ id: 2, name: 'Dune' });
      mockNoteRepository.create.mockResolvedValue({ id: 1 });

      const result = await service.process(rawText);

      expect(result.entries).toHaveLength(2);
      expect(mockTopicRepository.findOrCreate).toHaveBeenCalledTimes(2);
      expect(mockNoteRepository.create).toHaveBeenCalledTimes(2);
    });

    it('should return empty entries when AI finds no topics', async () => {
      mockTopicRepository.findAll.mockResolvedValue([]);
      mockAiProcessor.process.mockResolvedValue({ entries: [] });

      const result = await service.process('some unrecognized text');

      expect(result.entries).toHaveLength(0);
      expect(mockTopicRepository.findOrCreate).not.toHaveBeenCalled();
      expect(mockNoteRepository.create).not.toHaveBeenCalled();
    });
  });
});
