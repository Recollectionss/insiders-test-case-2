import { Module } from '@nestjs/common';
import {AuthModule} from "./modules/auth/auth.module";
import { RedisModule } from './modules/redis/redis.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
      AuthModule,
      RedisModule,
      PrismaModule
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
