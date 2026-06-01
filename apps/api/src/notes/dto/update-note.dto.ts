import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({
    description: 'The updated note content',
    example: 'Updated summary of chapter 3...',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
