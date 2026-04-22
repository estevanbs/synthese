import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller.js';
import { TopicService } from './topic.service.js';

@Module({
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
