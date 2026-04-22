import { Injectable } from '@nestjs/common';
import type { TopicRepository, Topic } from '@synthese/domain';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class PrismaTopicRepository implements TopicRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string): Promise<Topic> {
    return this.prisma.topic.create({ data: { name } });
  }

  async findById(id: number): Promise<Topic | null> {
    return this.prisma.topic.findUnique({ where: { id } });
  }

  async findAll(): Promise<Topic[]> {
    return this.prisma.topic.findMany({ orderBy: { name: 'asc' } });
  }

  async findOrCreate(name: string): Promise<Topic> {
    return this.prisma.topic.upsert({
      where: { name },
      create: { name },
      update: {},
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.note.deleteMany({ where: { topicId: id } }),
      this.prisma.rawText.deleteMany({ where: { topicId: id } }),
      this.prisma.topic.delete({ where: { id } }),
    ]);
  }
}
