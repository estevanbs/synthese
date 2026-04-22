import { Module } from '@nestjs/common';
import { SynthesizeService } from './synthesize.service.js';
import { SynthesizeController } from './synthesize.controller.js';

@Module({
  controllers: [SynthesizeController],
  providers: [SynthesizeService],
})
export class SynthesizeModule {}
