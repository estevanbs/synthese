import { PrismaTopicRepository } from './prisma-topic.repository';

describe('PrismaTopicRepository', () => {
  const prisma = {
    topic: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    note: {
      deleteMany: jest.fn(),
    },
    rawText: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  let repository: PrismaTopicRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaTopicRepository(prisma as never);
  });

  it('should create a topic by name', async () => {
    const topic = { id: 1, name: 'Dune', createdAt: new Date(), updatedAt: new Date() };
    prisma.topic.create.mockResolvedValue(topic);

    const result = await repository.create('Dune');

    expect(result).toBe(topic);
    expect(prisma.topic.create).toHaveBeenCalledWith({ data: { name: 'Dune' } });
  });

  it('should find a topic by id', async () => {
    const topic = { id: 1, name: 'Dune', createdAt: new Date(), updatedAt: new Date() };
    prisma.topic.findUnique.mockResolvedValue(topic);

    const result = await repository.findById(1);

    expect(result).toBe(topic);
    expect(prisma.topic.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should list topics alphabetically by name', async () => {
    const topics = [
      { id: 1, name: 'Abracadabra', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Dune', createdAt: new Date(), updatedAt: new Date() },
    ];
    prisma.topic.findMany.mockResolvedValue(topics);

    const result = await repository.findAll();

    expect(result).toBe(topics);
    expect(prisma.topic.findMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
  });

  it('should find or create a topic by unique name', async () => {
    const topic = { id: 1, name: 'Dune', createdAt: new Date(), updatedAt: new Date() };
    prisma.topic.upsert.mockResolvedValue(topic);

    const result = await repository.findOrCreate('Dune');

    expect(result).toBe(topic);
    expect(prisma.topic.upsert).toHaveBeenCalledWith({
      where: { name: 'Dune' },
      create: { name: 'Dune' },
      update: {},
    });
  });

  it('should delete topic notes, raw texts, and topic in one transaction', async () => {
    const deleteNotes = Symbol('delete-notes');
    const deleteRawTexts = Symbol('delete-raw-texts');
    const deleteTopic = Symbol('delete-topic');
    prisma.note.deleteMany.mockReturnValue(deleteNotes);
    prisma.rawText.deleteMany.mockReturnValue(deleteRawTexts);
    prisma.topic.delete.mockReturnValue(deleteTopic);
    prisma.$transaction.mockResolvedValue(undefined);

    await repository.delete(7);

    expect(prisma.note.deleteMany).toHaveBeenCalledWith({ where: { topicId: 7 } });
    expect(prisma.rawText.deleteMany).toHaveBeenCalledWith({ where: { topicId: 7 } });
    expect(prisma.topic.delete).toHaveBeenCalledWith({ where: { id: 7 } });
    expect(prisma.$transaction).toHaveBeenCalledWith([
      deleteNotes,
      deleteRawTexts,
      deleteTopic,
    ]);
  });
});
