import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from './user.constants';
import { UserJwtDataDto } from '../auth/dto/user-jwt-data.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(data: CreateUserDto): Promise<string> {
    await this.validateByEmail(data.email);
    try {
      const dataValues = await this.userRepository.create({ ...data });
      return dataValues.id;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(userData: UserJwtDataDto): Promise<UserDto> {
    const dataValues = await this.findUserByPk(userData.sub);
    return {
      id: dataValues.id,
      email: dataValues.email,
      username: dataValues.username,
    };
  }

  async findByEmail(email: string): Promise<UserDto> {
    const dataValues = await this.userRepository.findOne({ where: { email } });
    return {
      id: dataValues.id,
      email: dataValues.email,
      username: dataValues.username,
      password: dataValues.password,
    };
  }

  async update(userData: UserJwtDataDto, data: UpdateUserDto): Promise<void> {
    if (data.email) {
      await this.validateByEmail(data.email);
    }
    try {
      await this.userRepository.update(
        { ...data },
        { where: { id: userData.sub } },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(userData: UserJwtDataDto): Promise<void> {
    // Check user exist
    await this.findUserByPk(userData.sub);
    await this.userRepository.destroy({ where: { id: userData.sub } });
  }

  private async findUserByPk(id: string) {
    const dataValues = await this.userRepository.findByPk(id);
    if (!dataValues) {
      throw new NotFoundException('User not found');
    }
    return dataValues;
  }

  // Used for validation email (in db his unique)
  private async validateByEmail(email: string) {
    const dataValues = await this.userRepository.findOne({ where: { email } });
    if (dataValues) {
      throw new ConflictException('This email is already in use');
    }
    return;
  }
}
