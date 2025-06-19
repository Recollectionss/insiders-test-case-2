import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserJwtDataDto } from '../auth/dto/user-jwt-data.dto';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserDto): Promise<string> {
    try {
      const dataValues = await this.prismaService.users.create({ data });
      return dataValues.id;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(userData: UserJwtDataDto): Promise<UserDto> {
    const dataValues = await this.prismaService.users.findFirst({
      where: { id: userData.sub },
    });
    return {
      id: dataValues.id,
      username: dataValues.username,
    };
  }

  async findByUsername(username: string): Promise<UserDto> {
    const dataValues = await this.prismaService.users.findFirst({
      where: { username },
    });
    return {
      id: dataValues.id,
      username: dataValues.username,
      password: dataValues.password,
    };
  }

  async update(userData: UserJwtDataDto, data: UpdateUserDto): Promise<void> {
    try {
      await this.prismaService.users.update({
        where: { id: userData.sub },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(userData: UserJwtDataDto): Promise<void> {
    await this.prismaService.users.delete({ where: { id: userData.sub } });
  }

  private async validateByUsername(username: string): Promise<void> {
    const data = await this.prismaService.users.findFirst({
      where: { username },
    });
    if (data) throw new ConflictException('This usernaem is already in use');
  }
}
