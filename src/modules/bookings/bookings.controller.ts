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

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createBooking(
    @UserData() userData: UserJwtDataDto,
    @Body() data: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(userData, data);
  }
  @UseGuards(JwtGuard, AdminGuard)
  @Get()
  async getAllBookings(@Query() pagination: PaginationRequestDto) {
    return this.bookingsService.getAllBookings(pagination);
  }

  @Get('/rooms/available')
  async getAvailableRooms(@Body() data: GetAvailableBookingDto) {
    return this.bookingsService.getAvailableRooms(data);
  }

  @UseGuards(JwtGuard)
  @Delete('/booking/:id')
  async deleteOne(
    @Param('id') id: string,
    @UserData() userData: UserJwtDataDto,
  ) {
    return this.bookingsService.deleteOne(id, userData);
  }
}
