import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { PrismaTopicRepository } from './repositories/prisma-topic.repository.js';
import { PrismaRawTextRepository } from './repositories/prisma-raw-text.repository.js';
import {
  TOPIC_REPOSITORY,
  RAW_TEXT_REPOSITORY,
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
  ],
  exports: [
    PrismaService,
    TOPIC_REPOSITORY,
    RAW_TEXT_REPOSITORY,
  ],
})
export class DatabaseModule {}
