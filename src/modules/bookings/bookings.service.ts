import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserJwtDataDto } from '../auth/dto/user-jwt-data.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetAvailableBookingDto } from './dto/get-available-booking.dto';
import { PaginationRequestDto } from '../../shared/dto/pagination/pagination-request.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBooking(userData: UserJwtDataDto, data: CreateBookingDto) {
    const overlap = await this.prismaService.bookings.findFirst({
      where: {
        room_id: data.room_id,
        NOT: [
          {
            end_time: { lte: data.start_time },
          },
          {
            start_time: { gte: data.end_time },
          },
        ],
      },
    });

    if (overlap) {
      throw new ConflictException('This time slot is already booked.');
    }
    const newBooking = { ...data, user_id: userData.sub };
    return this.prismaService.bookings.create({ data: newBooking });
  }

  async getAllBookings(pagination: PaginationRequestDto) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.bookings.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { id: 'asc' },
      }),
      this.prismaService.bookings.count(),
    ]);
    return {
      rooms: data,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async getAvailableRooms(data: GetAvailableBookingDto) {
    if (isNaN(data.start.getTime()) || isNaN(data.end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    return this.prismaService.rooms.findMany({
      where: {
        bookings: {
          none: {
            NOT: [
              { end_time: { lte: data.start } },
              { start_time: { gte: data.end } },
            ],
          },
        },
      },
    });
  }

  async deleteOne(id: string, userData: UserJwtDataDto) {
    const data = await this.prismaService.bookings.findFirst({ where: { id } });
    if (!data) {
      throw new NotFoundException('Booking not found');
    }

    if (data.user_id !== userData.sub && !userData.admin) {
      throw new ForbiddenException(
        'You are not allowed to delete this booking',
      );
    }

    await this.prismaService.bookings.delete({ where: { id } });
  }

  async getUserBookings(userData: UserJwtDataDto) {
    return this.prismaService.bookings.findMany({
      where: { user_id: userData.sub },
    });
  }
}
