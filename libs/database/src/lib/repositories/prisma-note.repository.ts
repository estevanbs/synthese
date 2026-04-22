import { Injectable } from '@nestjs/common';
import type { NoteRepository, Note } from '@synthese/domain';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class PrismaNoteRepository implements NoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(content: string, topicId: number): Promise<Note> {
    return this.prisma.note.create({ data: { content, topicId } });
  }

  async findLatestByTopicId(topicId: number): Promise<Note | null> {
    return this.prisma.note.findFirst({
      where: { topicId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
