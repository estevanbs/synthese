import { Test, TestingModule } from '@nestjs/testing';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

describe('TopicController', () => {
  let controller: TopicController;

  const mockTopicService = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [{ provide: TopicService, useValue: mockTopicService }],
    }).compile();

    controller = module.get<TopicController>(TopicController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a topic and return it', async () => {
      const topic = { id: 1, name: 'Physics', createdAt: new Date(), updatedAt: new Date() };
      mockTopicService.create.mockResolvedValue(topic);

      const result = await controller.create({ name: 'Physics' });

      expect(result).toEqual(topic);
      expect(mockTopicService.create).toHaveBeenCalledWith('Physics');
    });
  });

  describe('findAll', () => {
    it('should return an array of topics', async () => {
      const topics = [{ id: 1, name: 'Physics', createdAt: new Date(), updatedAt: new Date() }];
      mockTopicService.findAll.mockResolvedValue(topics);

      const result = await controller.findAll();

      expect(result).toEqual(topics);
    });
  });

  describe('findOne', () => {
    it('should return a topic by id', async () => {
      const topic = { id: 1, name: 'Physics', createdAt: new Date(), updatedAt: new Date() };
      mockTopicService.findById.mockResolvedValue(topic);

      const result = await controller.findOne(1);

      expect(result).toEqual(topic);
      expect(mockTopicService.findById).toHaveBeenCalledWith(1);
    });

    it('should return null if topic not found', async () => {
      mockTopicService.findById.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a topic by id', async () => {
      mockTopicService.delete.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(result).toBeUndefined();
      expect(mockTopicService.delete).toHaveBeenCalledWith(1);
    });
  });
});
