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
    return this.prisma.topic.findMany();
  }
}
