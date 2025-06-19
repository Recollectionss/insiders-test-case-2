import { PaginationRequestDto } from './pagination-request.dto';

export class PaginationResponseDto extends PaginationRequestDto {
  totalPages: number;
}
