import { Test, TestingModule } from '@nestjs/testing';
import { SynthesizeController } from './synthesize.controller';
import { SynthesizeService } from './synthesize.service';
import { RAW_TEXT_REPOSITORY } from '@synthese/domain';

describe('SynthesizeController', () => {
  let controller: SynthesizeController;
  let service: SynthesizeService;

  const mockRawTextRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SynthesizeController],
      providers: [
        SynthesizeService,
        {
          provide: RAW_TEXT_REPOSITORY,
          useValue: mockRawTextRepository,
        },
      ],
    }).compile();

    controller = module.get<SynthesizeController>(SynthesizeController);
    service = module.get<SynthesizeService>(SynthesizeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call saveRawText with correct parameters', async () => {
      mockRawTextRepository.create.mockResolvedValue({
        id: 1,
        content: 'my raw text',
        topicId: 1,
        createdAt: new Date(),
      });

      const dto = { text: 'my raw text', topicId: 1 };
      const result = await controller.create(dto);

      expect(result).toBeUndefined();
      expect(mockRawTextRepository.create).toHaveBeenCalledWith(
        'my raw text',
        1,
      );
    });
  });
});
