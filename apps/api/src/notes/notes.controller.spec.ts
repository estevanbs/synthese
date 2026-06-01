import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NoteService } from './note.service';

describe('NotesController', () => {
  let controller: NotesController;

  const mockNoteService = {
    findLatestByTopicId: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [{ provide: NoteService, useValue: mockNoteService }],
    }).compile();

    controller = module.get<NotesController>(NotesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findLatest', () => {
    it('should delegate to NoteService and return the latest note', async () => {
      const note = { id: 1, content: 'summary', topicId: 3, createdAt: new Date() };
      mockNoteService.findLatestByTopicId.mockResolvedValue(note);

      const result = await controller.findLatest(3);

      expect(result).toEqual(note);
      expect(mockNoteService.findLatestByTopicId).toHaveBeenCalledWith(3);
    });
  });

  describe('update', () => {
    it('should delegate to NoteService.update and return the updated note', async () => {
      const updated = { id: 5, content: 'edited content', topicId: 1, createdAt: new Date() };
      mockNoteService.update.mockResolvedValue(updated);

      const result = await controller.update(5, { content: 'edited content' });

      expect(result).toEqual(updated);
      expect(mockNoteService.update).toHaveBeenCalledWith(5, 'edited content');
    });
  });
});
