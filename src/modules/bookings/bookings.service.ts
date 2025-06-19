import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserJwtDataDto } from '../auth/dto/user-jwt-data.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

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
}
