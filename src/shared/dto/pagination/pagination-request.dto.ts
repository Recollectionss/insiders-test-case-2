import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PaginationRequestDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  limit: number = 10;
}
