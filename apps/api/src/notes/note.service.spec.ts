import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NoteService } from './note.service';
import { NOTE_REPOSITORY } from '@synthese/domain';

describe('NoteService', () => {
  let service: NoteService;

  const mockNoteRepository = {
    findLatestByTopicId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        { provide: NOTE_REPOSITORY, useValue: mockNoteRepository },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findLatestByTopicId', () => {
    it('should return the latest note for a topic', async () => {
      const note = { id: 1, content: 'some content', topicId: 1, createdAt: new Date() };
      mockNoteRepository.findLatestByTopicId.mockResolvedValue(note);

      const result = await service.findLatestByTopicId(1);

      expect(result).toEqual(note);
      expect(mockNoteRepository.findLatestByTopicId).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when no note exists for topic', async () => {
      mockNoteRepository.findLatestByTopicId.mockResolvedValue(null);

      await expect(service.findLatestByTopicId(999)).rejects.toThrow(NotFoundException);
    });
  });
});
