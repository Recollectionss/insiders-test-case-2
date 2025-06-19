import { PaginationRequestDto } from './pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto extends PaginationRequestDto {
  @ApiProperty({
    description: 'Total number of pages available',
    example: 5,
  })
  totalPages: number;
}
