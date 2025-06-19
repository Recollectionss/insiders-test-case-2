import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtGuard } from '../../shared/guards/jwt/jwt.guard';
import { AdminGuard } from '../../shared/guards/admin/admin.guard';
import { PaginationRequestDto } from '../../shared/dto/pagination/pagination-request.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RoomDto } from './dto/room.dto';
import { RoomsDto } from './dto/rooms.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Room created successfully',
    type: RoomDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden. Admins only.' })
  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List of rooms with pagination',
    type: RoomsDto,
  })
  @ApiQuery({ name: 'page', type: Number, required: true, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: true, example: 10 })
  @Get('available')
  findAll(@Query() pagination: PaginationRequestDto) {
    return this.roomService.findAll(pagination);
  }

  @ApiOkResponse({ description: 'Room found', type: RoomDto })
  @ApiNotFoundResponse({ description: 'Room not found' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the room',
    example: 'e8f6c2f4-9c43-43c4-b2a3-1245d8165d1a',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Room deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden. Admins only.' })
  @ApiNotFoundResponse({ description: 'Room not found' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the room to delete',
    example: 'e8f6c2f4-9c43-43c4-b2a3-1245d8165d1a',
  })
  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
