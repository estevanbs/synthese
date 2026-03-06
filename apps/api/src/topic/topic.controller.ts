import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { TopicRepository } from '@synthese/domain';
import { TOPIC_REPOSITORY } from '@synthese/domain';
import { CreateTopicDto } from './dto/create-topic.dto.js';

@ApiTags('Topics')
@Controller('topics')
export class TopicController {
  constructor(
    @Inject(TOPIC_REPOSITORY)
    private readonly topicRepository: TopicRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiResponse({ status: 201, description: 'Topic created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async create(@Body() dto: CreateTopicDto) {
    return this.topicRepository.create(dto.name);
  }

  @Get()
  @ApiOperation({ summary: 'List all topics' })
  @ApiResponse({ status: 200, description: 'List of topics' })
  async findAll() {
    return this.topicRepository.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a topic by ID' })
  @ApiResponse({ status: 200, description: 'Topic found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.topicRepository.findById(id);
  }
}
