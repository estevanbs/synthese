import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SynthesizeService } from './synthesize.service.js';
import { CreateRawTextDto } from './dto/create-raw-text.dto.js';

@ApiTags('Synthesize')
@Controller('synthesize')
export class SynthesizeController {
  constructor(private readonly synthesizeService: SynthesizeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save raw text for a topic' })
  @ApiResponse({ status: 200, description: 'Raw text saved successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async create(@Body() dto: CreateRawTextDto): Promise<void> {
    await this.synthesizeService.saveRawText(dto.text, dto.topicId);
  }
}
