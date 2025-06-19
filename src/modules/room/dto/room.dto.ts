import { CreateRoomDto } from './create-room.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RoomDto extends CreateRoomDto {
  @ApiProperty({
    description: 'Unique identifier of the room',
    example: 'e8f6c2f4-9c43-43c4-b2a3-1245d8165d1a',
  })
  id: string;
}
