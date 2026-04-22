import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NoteService } from './note.service.js';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly noteService: NoteService) {}

  @Get('topic/:topicId')
  @ApiOperation({ summary: 'Get the latest AI note for a topic' })
  @ApiResponse({ status: 200, description: 'Latest note for the topic' })
  @ApiResponse({ status: 404, description: 'No note found for topic' })
  async findLatest(@Param('topicId', ParseIntPipe) topicId: number) {
    return this.noteService.findLatestByTopicId(topicId);
  }
}
