import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, BookingsModule],
  exports: [UserService],
})
export class UserModule {}
