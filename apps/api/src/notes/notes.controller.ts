import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { NoteRepository } from '@synthese/domain';
import { NOTE_REPOSITORY } from '@synthese/domain';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(
    @Inject(NOTE_REPOSITORY)
    private readonly noteRepository: NoteRepository,
  ) {}

  @Get('topic/:topicId')
  @ApiOperation({ summary: 'Get the latest AI note for a topic' })
  @ApiResponse({ status: 200, description: 'Latest note for the topic' })
  @ApiResponse({ status: 404, description: 'No note found for topic' })
  async findLatest(@Param('topicId', ParseIntPipe) topicId: number) {
    const note = await this.noteRepository.findLatestByTopicId(topicId);
    if (!note) {
      throw new NotFoundException(`No note found for topic ${topicId}`);
    }
    return note;
  }
}
