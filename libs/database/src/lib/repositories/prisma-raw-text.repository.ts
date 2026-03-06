import { Injectable } from '@nestjs/common';
import type { RawTextRepository, RawText } from '@synthese/domain';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class PrismaRawTextRepository implements RawTextRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(content: string, topicId: number): Promise<RawText> {
    return this.prisma.rawText.create({
      data: { content, topicId },
    });
  }
}
