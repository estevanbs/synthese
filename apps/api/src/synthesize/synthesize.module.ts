import { Module } from '@nestjs/common';
import { SynthesizeService } from './synthesize.service';
import { SynthesizeController } from './synthesize.controller';

@Module({
  controllers: [SynthesizeController],
  providers: [SynthesizeService],
})
export class SynthesizeModule {}
