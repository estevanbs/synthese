import { Injectable, Inject } from '@nestjs/common';
import type { RawTextRepository } from '@synthese/domain';
import { RAW_TEXT_REPOSITORY } from '@synthese/domain';

@Injectable()
export class SynthesizeService {
  constructor(
    @Inject(RAW_TEXT_REPOSITORY)
    private readonly rawTextRepository: RawTextRepository,
  ) {}

  async saveRawText(content: string, topicId: number): Promise<void> {
    await this.rawTextRepository.create(content, topicId);
  }
}
