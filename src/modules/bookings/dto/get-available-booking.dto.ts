import { IsDate, IsNotEmpty } from 'class-validator';

export class GetAvailableBookingDto {
  @IsNotEmpty()
  @IsDate()
  start: Date;

  @IsNotEmpty()
  @IsDate()
  end: Date;
}
