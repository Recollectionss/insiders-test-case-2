import { BookingDto } from './booking.dto';
import { PaginationResponseDto } from '../../../shared/dto/pagination/pagination-response.dto';

export class GetAllBookingsDto extends PaginationResponseDto{
  rooms: BookingDto[];
}
