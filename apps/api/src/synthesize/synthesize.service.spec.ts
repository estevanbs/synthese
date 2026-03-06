import { Test, TestingModule } from '@nestjs/testing';
import { SynthesizeService } from './synthesize.service';
import { RAW_TEXT_REPOSITORY } from '@synthese/domain';

describe('SynthesizeService', () => {
  let service: SynthesizeService;

  const mockRawTextRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SynthesizeService,
        {
          provide: RAW_TEXT_REPOSITORY,
          useValue: mockRawTextRepository,
        },
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

  describe('saveRawText', () => {
    it('should call repository create with content and topicId', async () => {
      mockRawTextRepository.create.mockResolvedValue({
        id: 1,
        content: 'some text',
        topicId: 2,
        createdAt: new Date(),
      });

      await service.saveRawText('some text', 2);

      expect(mockRawTextRepository.create).toHaveBeenCalledWith('some text', 2);
    });
  });
});
