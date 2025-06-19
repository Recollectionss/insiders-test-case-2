import { PaginationResponseDto } from '../../../shared/dto/pagination/pagination-response.dto';
import { RoomDto } from './room.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RoomsDto extends PaginationResponseDto {
  @ApiProperty({
    type: [RoomDto],
    description: 'List of rooms with pagination',
  })
  rooms: RoomDto[];
}
