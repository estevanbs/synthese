import { Injectable, Inject } from '@nestjs/common';
import type { TopicRepository, Topic } from '@synthese/domain';
import { TOPIC_REPOSITORY } from '@synthese/domain';

@Injectable()
export class TopicService {
  constructor(
    @Inject(TOPIC_REPOSITORY)
    private readonly topicRepository: TopicRepository,
  ) {}

  async create(name: string): Promise<Topic> {
    return this.topicRepository.create(name);
  }

  async findAll(): Promise<Topic[]> {
    return this.topicRepository.findAll();
  }

  async findById(id: number): Promise<Topic | null> {
    return this.topicRepository.findById(id);
  }

  async delete(id: number): Promise<void> {
    return this.topicRepository.delete(id);
  }
}
