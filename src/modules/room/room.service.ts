import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationRequestDto } from '../../shared/dto/pagination/pagination-request.dto';
import { RoomDto } from './dto/room.dto';
import { RoomsDto } from './dto/rooms.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: CreateRoomDto) {
    return this.prismaService.rooms.create({ data });
  }

  async findAll(pagination: PaginationRequestDto): Promise<RoomsDto> {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.rooms.findMany({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { name: 'asc' },
      }),
      this.prismaService.rooms.count(),
    ]);
    return {
      rooms: data,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async findOne(id: string): Promise<RoomDto> {
    return this.prismaService.rooms.findFirst({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.users.delete({ where: { id } });
  }
}
