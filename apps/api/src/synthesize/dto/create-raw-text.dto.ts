import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRawTextDto {
  @ApiProperty({ description: 'The raw text content to save', example: 'Quantum mechanics describes nature at the atomic scale' })
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiProperty({ description: 'The ID of the topic to associate with', example: 1 })
  @IsInt()
  topicId!: number;
}
