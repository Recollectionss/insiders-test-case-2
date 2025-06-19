import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsNumber } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Name of the room',
    maxLength: 20,
    example: 'Conference Room A',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  name: string;

  @ApiProperty({
    description: 'Capacity of the room (number of people)',
    example: 12,
  })
  @IsNotEmpty()
  @IsNumber()
  capacity: number;
}
