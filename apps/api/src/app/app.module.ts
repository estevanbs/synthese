import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from '@synthese/database';
import { TopicModule } from '../topic/topic.module.js';
import { SynthesizeModule } from '../synthesize/synthesize.module.js';

@Module({
  imports: [DatabaseModule, TopicModule, SynthesizeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
