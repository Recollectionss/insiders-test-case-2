import { Controller, Get, Body, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../../shared/guards/jwt/jwt.guard';
import { UserData } from '../../shared/decorators/user-data/user-data.decorator';
import { UserJwtDataDto } from '../auth/dto/user-jwt-data.dto';
import { UserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  findOne(@UserData() userData: UserJwtDataDto): Promise<UserDto> {
    return this.userService.findById(userData);
  }

  @ApiOperation({ summary: 'Update current user data' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 409, description: 'Email is already in use' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  update(
    @UserData() userData: UserJwtDataDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return this.userService.update(userData, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete()
  remove(@UserData() userData: UserJwtDataDto): Promise<void> {
    return this.userService.remove(userData);
  }
}
