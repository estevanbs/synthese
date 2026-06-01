import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NoteService } from './note.service';
import { NOTE_REPOSITORY } from '@synthese/domain';

describe('NoteService', () => {
  let service: NoteService;

  const mockNoteRepository = {
    findLatestByTopicId: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
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

  describe('update', () => {
    it('should update and return the note when it exists', async () => {
      const existing = { id: 5, content: 'old content', topicId: 1, createdAt: new Date() };
      const updated = { id: 5, content: 'new content', topicId: 1, createdAt: existing.createdAt };
      mockNoteRepository.findById.mockResolvedValue(existing);
      mockNoteRepository.update.mockResolvedValue(updated);

      const result = await service.update(5, 'new content');

      expect(result).toEqual(updated);
      expect(mockNoteRepository.findById).toHaveBeenCalledWith(5);
      expect(mockNoteRepository.update).toHaveBeenCalledWith(5, 'new content');
    });

    it('should throw NotFoundException when note does not exist', async () => {
      mockNoteRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, 'content')).rejects.toThrow(NotFoundException);
      expect(mockNoteRepository.update).not.toHaveBeenCalled();
    });
  });
});
