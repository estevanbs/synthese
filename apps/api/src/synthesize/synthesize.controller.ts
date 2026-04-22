import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SynthesizeService } from './synthesize.service.js';
import { SynthesizeDto } from './dto/synthesize.dto.js';
import type { SynthesizeResult } from './dto/synthesize-result.dto.js';

@ApiTags('Synthesize')
@Controller('synthesize')
export class SynthesizeController {
  constructor(private readonly synthesizeService: SynthesizeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process free-form notes with AI' })
  @ApiResponse({ status: 200, description: 'Notes processed and saved' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async process(@Body() dto: SynthesizeDto): Promise<SynthesizeResult> {
    return this.synthesizeService.process(dto.text);
  }
}
