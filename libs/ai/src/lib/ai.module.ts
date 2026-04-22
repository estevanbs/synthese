import { Module, Global } from '@nestjs/common';
import { ClaudeAiProcessorService } from './claude-ai-processor.service.js';
import { AI_PROCESSOR } from '@synthese/domain';

@Global()
@Module({
  providers: [
    {
      provide: AI_PROCESSOR,
      useClass: ClaudeAiProcessorService,
    },
  ],
  exports: [AI_PROCESSOR],
})
export class AiModule {}
