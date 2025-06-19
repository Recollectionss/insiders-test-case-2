import { Body, Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../../shared/guards/jwt/jwt.guard';
import { UserData } from '../../shared/decorators/user-data/user-data.decorator';
import { UserJwtDataDto } from '../auth/dto/user-jwt-data.dto';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get current user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user profile.',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid JWT.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get()
  async findOne(@UserData() userData: UserJwtDataDto): Promise<UserDto> {
    return await this.userService.findById(userData);
  }

  @ApiOperation({ summary: 'Update current user data' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 409, description: 'Username is already in use' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async update(
    @UserData() userData: UserJwtDataDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return await this.userService.update(userData, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete()
  async remove(@UserData() userData: UserJwtDataDto): Promise<void> {
    return await this.userService.remove(userData);
  }

  @UseGuards(JwtGuard)
  @Get('bookings')
  async getUserBookings(@UserData() userData: UserJwtDataDto) {
    return this.userService.getUserBookings(userData);
  }
}
