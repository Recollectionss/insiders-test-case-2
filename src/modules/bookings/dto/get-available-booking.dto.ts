import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAvailableBookingDto {
  @ApiProperty({
    description: 'Start of the desired booking period (ISO 8601 format)',
    example: '2025-06-21T10:00:00Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  start: Date;

  @ApiProperty({
    description: 'End of the desired booking period (ISO 8601 format)',
    example: '2025-06-21T12:00:00Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  end: Date;
}
