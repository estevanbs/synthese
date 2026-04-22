import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SynthesizeDto {
  @ApiProperty({ description: 'Free-form text with notes about any topic' })
  @IsString()
  @IsNotEmpty()
  text!: string;
}
