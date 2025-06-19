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
import { BookingDto } from './dto/booking.dto';
import { GetAllBookingsDto } from './dto/get-all-bookings.dto';
import { RoomDto } from '../room/dto/room.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class BookingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBooking(
    userData: UserJwtDataDto,
    data: CreateBookingDto,
  ): Promise<BookingDto> {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const roomExists = await tx.rooms.findUnique({
          where: { id: data.room_id },
        });

        if (!roomExists) {
          throw new NotFoundException('Room not found');
        }
        const overlap = await tx.bookings.findFirst({
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
        return tx.bookings.create({ data: newBooking });
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Someone have already booked this time slot.',
        );
      }
      throw error;
    }
  }

  async getAllBookings(
    pagination: PaginationRequestDto,
  ): Promise<GetAllBookingsDto> {
    const page = Number(pagination.page) ?? 1;
    const limit = Number(pagination.limit) ?? 10;
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.bookings.findMany({
        where: { is_deleted: false },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prismaService.bookings.count(),
    ]);
    return {
      rooms: data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAvailableRooms(data: GetAvailableBookingDto): Promise<RoomDto[]> {
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

  async deleteOne(id: string, userData: UserJwtDataDto): Promise<void> {
    const data = await this.prismaService.bookings.findFirst({ where: { id } });
    if (!data) {
      throw new NotFoundException('Booking not found');
    }

    if (data.user_id !== userData.sub && !userData.admin) {
      throw new ForbiddenException(
        'You are not allowed to delete this booking',
      );
    }

    await this.prismaService.bookings.update({
      where: { id },
      data: { is_deleted: true },
    });
  }

  async restoreOne(id: string, userData: UserJwtDataDto): Promise<void> {
    const data = await this.prismaService.bookings.findFirst({ where: { id } });
    if (!data) {
      throw new NotFoundException('Booking not found');
    }

    if (data.user_id !== userData.sub && !userData.admin) {
      throw new ForbiddenException(
        'You are not allowed to delete this booking',
      );
    }

    const overlapping = await this.prismaService.bookings.findFirst({
      where: {
        room_id: data.room_id,
        is_deleted: false,
        NOT: [
          { end_time: { lte: data.start_time } },
          { start_time: { gte: data.end_time } },
        ],
      },
    });

    if (overlapping) {
      throw new ConflictException('The time slot is already booked');
    }

    await this.prismaService.bookings.update({
      where: { id },
      data: { is_deleted: false },
    });
  }

  async getUserBookings(userData: UserJwtDataDto): Promise<BookingDto[]> {
    return this.prismaService.bookings.findMany({
      where: { user_id: userData.sub },
    });
  }
}
