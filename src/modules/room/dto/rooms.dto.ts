import { PaginationResponseDto } from '../../../shared/dto/pagination/pagination-response.dto';
import { RoomDto } from './room.dto';

export class RoomsDto extends PaginationResponseDto {
  rooms: RoomDto[];
}
