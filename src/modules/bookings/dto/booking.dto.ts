import { ApiProperty } from '@nestjs/swagger';

export class BookingDto {
  @ApiProperty({
    description: 'Unique identifier of the booking',
    example: 'a4e8f774-bc7d-4aa2-baa5-89fe43c31dc1',
  })
  id: string;

  @ApiProperty({
    description: 'Start time of the booking (ISO 8601 format)',
    example: '2025-06-21T10:00:00Z',
  })
  start_time: Date;

  @ApiProperty({
    description: 'End time of the booking (ISO 8601 format)',
    example: '2025-06-21T12:00:00Z',
  })
  end_time: Date;

  @ApiProperty({
    description: 'ID of the user who created the booking',
    example: 'c152a860-9d51-4b32-a308-0e1f71e4d978',
  })
  user_id: string;

  @ApiProperty({
    description: 'ID of the booked room',
    example: 'b3fdb7f5-0f19-4aef-9aa6-57e3f1d2a7a1',
  })
  room_id: string;
}
