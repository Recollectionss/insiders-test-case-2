import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID of the room to be booked',
    example: 'e29b7e80-5a3a-4c8b-9e01-123456789abc',
  })
  @IsNotEmpty()
  @IsString()
  room_id: string;

  @ApiProperty({
    description: 'Start time of the booking (ISO 8601 format)',
    example: '2025-06-21T10:00:00Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  start_time: Date;

  @ApiProperty({
    description: 'End time of the booking (ISO 8601 format)',
    example: '2025-06-21T12:00:00Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  end_time: Date;
}
