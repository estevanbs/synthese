import { Test, TestingModule } from '@nestjs/testing';
import { SynthesizeController } from './synthesize.controller';
import { SynthesizeService } from './synthesize.service';

describe('SynthesizeController', () => {
  let controller: SynthesizeController;

  const mockSynthesizeService = {
    process: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SynthesizeController],
      providers: [
        { provide: SynthesizeService, useValue: mockSynthesizeService },
      ],
    }).compile();

    controller = module.get<SynthesizeController>(SynthesizeController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('process', () => {
    it('should delegate to SynthesizeService and return result', async () => {
      const result = {
        entries: [{ topicId: 1, topicName: 'Abracadabra', confirmation: 'Saved' }],
      };
      mockSynthesizeService.process.mockResolvedValue(result);

      const response = await controller.process({ text: 'some notes' });

      expect(mockSynthesizeService.process).toHaveBeenCalledWith('some notes');
      expect(response).toEqual(result);
    });
  });
});
