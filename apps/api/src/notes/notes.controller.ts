import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NoteService } from './note.service.js';
import { UpdateNoteDto } from './dto/update-note.dto.js';

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

  @Patch(':id')
  @ApiOperation({ summary: 'Update note content' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.noteService.update(id, dto.content);
  }
}

