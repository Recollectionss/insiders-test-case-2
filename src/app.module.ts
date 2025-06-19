import { Module } from '@nestjs/common';
import {AuthModule} from "./modules/auth/auth.module";
import { RedisModule } from './modules/redis/redis.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './modules/room/room.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({load:[appConfig]}),
      AuthModule,
      RedisModule,
      PrismaModule,
      UserModule,
      RoomModule,
      BookingsModule
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
