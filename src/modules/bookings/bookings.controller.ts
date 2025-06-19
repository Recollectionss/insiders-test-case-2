import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtGuard } from '../../shared/guards/jwt/jwt.guard';
import { UserData } from '../../shared/decorators/user-data/user-data.decorator';
import { UserJwtDataDto } from '../auth/dto/user-jwt-data.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetAvailableBookingDto } from './dto/get-available-booking.dto';
import { AdminGuard } from '../../shared/guards/admin/admin.guard';
import { PaginationRequestDto } from '../../shared/dto/pagination/pagination-request.dto';
import { BookingDto } from './dto/booking.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GetAllBookingsDto } from './dto/get-all-bookings.dto';
import { RoomDto } from '../room/dto/room.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Booking created successfully',
    type: BookingDto,
  })
  @ApiConflictResponse({ description: 'This time slot is already booked' })
  @ApiBody({ type: CreateBookingDto })
  @UseGuards(JwtGuard)
  @Post()
  async createBooking(
    @UserData() userData: UserJwtDataDto,
    @Body() data: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(userData, data);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List of all bookings with pagination',
    type: GetAllBookingsDto,
  })
  @ApiForbiddenResponse({ description: 'Access denied. Admins only.' })
  @ApiQuery({ name: 'page', type: Number, required: true, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: true, example: 10 })
  @UseGuards(JwtGuard, AdminGuard)
  @Get()
  async getAllBookings(@Query() pagination: PaginationRequestDto) {
    return this.bookingsService.getAllBookings(pagination);
  }

  @ApiOkResponse({
    description: 'List of available rooms for the specified time range',
    type: [RoomDto],
  })
  @ApiBadRequestResponse({ description: 'Invalid date format' })
  @ApiBody({ type: GetAvailableBookingDto })
  @Get('/rooms/available')
  async getAvailableRooms(@Body() data: GetAvailableBookingDto) {
    return this.bookingsService.getAvailableRooms(data);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID of the booking to delete',
    example: 'a4e8f774-bc7d-4aa2-baa5-89fe43c31dc1',
  })
  @ApiNoContentResponse({ description: 'Booking deleted successfully' })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  @ApiForbiddenResponse({
    description: 'Forbidden: You are not allowed to delete this booking',
  })
  @UseGuards(JwtGuard)
  @Delete('/booking/:id')
  async deleteOne(
    @Param('id') id: string,
    @UserData() userData: UserJwtDataDto,
  ) {
    return this.bookingsService.deleteOne(id, userData);
  }
}
