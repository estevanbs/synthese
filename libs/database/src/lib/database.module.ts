import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { PrismaTopicRepository } from './repositories/prisma-topic.repository.js';
import { PrismaRawTextRepository } from './repositories/prisma-raw-text.repository.js';
import { PrismaNoteRepository } from './repositories/prisma-note.repository.js';
import {
  TOPIC_REPOSITORY,
  RAW_TEXT_REPOSITORY,
  NOTE_REPOSITORY,
} from '@synthese/domain';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: TOPIC_REPOSITORY,
      useClass: PrismaTopicRepository,
    },
    {
      provide: RAW_TEXT_REPOSITORY,
      useClass: PrismaRawTextRepository,
    },
    {
      provide: NOTE_REPOSITORY,
      useClass: PrismaNoteRepository,
    },
  ],
  exports: [
    PrismaService,
    TOPIC_REPOSITORY,
    RAW_TEXT_REPOSITORY,
    NOTE_REPOSITORY,
  ],
})
export class DatabaseModule {}
