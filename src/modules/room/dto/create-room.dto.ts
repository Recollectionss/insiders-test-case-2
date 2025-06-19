import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;
}
