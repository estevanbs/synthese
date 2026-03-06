import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty({ description: 'The name of the topic', example: 'Physics' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
