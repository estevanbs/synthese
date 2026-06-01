import { Module, Global } from '@nestjs/common';
import { ClaudeAiProcessorService } from './claude-ai-processor.service.js';
import { OllamaAiProcessorService } from './ollama-ai-processor.service.js';
import { AI_PROCESSOR } from '@synthese/domain';

const aiProcessorFactory = {
  provide: AI_PROCESSOR,
  useFactory: () => {
    const provider = process.env['LLM_PROVIDER'] || 'claude';
    if (provider === 'ollama') {
      return new OllamaAiProcessorService();
    }
    return new ClaudeAiProcessorService();
  },
};

@Global()
@Module({
  providers: [aiProcessorFactory],
  exports: [AI_PROCESSOR],
})
export class AiModule {}
