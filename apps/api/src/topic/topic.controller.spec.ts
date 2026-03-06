import { Test, TestingModule } from '@nestjs/testing';
import { TopicController } from './topic.controller';
import { TOPIC_REPOSITORY } from '@synthese/domain';

describe('TopicController', () => {
  let controller: TopicController;

  const mockTopicRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [
        {
          provide: TOPIC_REPOSITORY,
          useValue: mockTopicRepository,
        },
      ],
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
      const topic = {
        id: 1,
        name: 'Physics',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTopicRepository.create.mockResolvedValue(topic);

      const result = await controller.create({ name: 'Physics' });

      expect(result).toEqual(topic);
      expect(mockTopicRepository.create).toHaveBeenCalledWith('Physics');
    });
  });

  describe('findAll', () => {
    it('should return an array of topics', async () => {
      const topics = [
        {
          id: 1,
          name: 'Physics',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockTopicRepository.findAll.mockResolvedValue(topics);

      const result = await controller.findAll();

      expect(result).toEqual(topics);
    });
  });

  describe('findOne', () => {
    it('should return a topic by id', async () => {
      const topic = {
        id: 1,
        name: 'Physics',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTopicRepository.findById.mockResolvedValue(topic);

      const result = await controller.findOne(1);

      expect(result).toEqual(topic);
      expect(mockTopicRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null if topic not found', async () => {
      mockTopicRepository.findById.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
    });
  });
});
