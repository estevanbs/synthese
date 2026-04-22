import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from '@synthese/database';
import { AiModule } from '@synthese/ai';
import { TopicModule } from '../topic/topic.module.js';
import { SynthesizeModule } from '../synthesize/synthesize.module.js';
import { NotesModule } from '../notes/notes.module.js';

@Module({
  imports: [DatabaseModule, AiModule, TopicModule, SynthesizeModule, NotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
