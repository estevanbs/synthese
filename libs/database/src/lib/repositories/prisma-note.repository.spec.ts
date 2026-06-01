import { PrismaNoteRepository } from './prisma-note.repository';

describe('PrismaNoteRepository', () => {
  const prisma = {
    note: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  let repository: PrismaNoteRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaNoteRepository(prisma as never);
  });

  it('should create a note for a topic', async () => {
    const note = { id: 1, content: 'summary', topicId: 2, createdAt: new Date() };
    prisma.note.create.mockResolvedValue(note);

    const result = await repository.create('summary', 2);

    expect(result).toBe(note);
    expect(prisma.note.create).toHaveBeenCalledWith({
      data: { content: 'summary', topicId: 2 },
    });
  });

  it('should find a note by id', async () => {
    const note = { id: 1, content: 'summary', topicId: 2, createdAt: new Date() };
    prisma.note.findUnique.mockResolvedValue(note);

    const result = await repository.findById(1);

    expect(result).toBe(note);
    expect(prisma.note.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should find the latest note by topic id', async () => {
    const note = { id: 2, content: 'latest', topicId: 3, createdAt: new Date() };
    prisma.note.findFirst.mockResolvedValue(note);

    const result = await repository.findLatestByTopicId(3);

    expect(result).toBe(note);
    expect(prisma.note.findFirst).toHaveBeenCalledWith({
      where: { topicId: 3 },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should update note content', async () => {
    const note = { id: 1, content: 'edited', topicId: 2, createdAt: new Date() };
    prisma.note.update.mockResolvedValue(note);

    const result = await repository.update(1, 'edited');

    expect(result).toBe(note);
    expect(prisma.note.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { content: 'edited' },
    });
  });
});
