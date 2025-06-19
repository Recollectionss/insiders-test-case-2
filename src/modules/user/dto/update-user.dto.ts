import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongP@ssw0rd',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password?: string;
}
