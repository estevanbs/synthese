import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller.js';

@Module({
  controllers: [TopicController],
})
export class TopicModule {}
