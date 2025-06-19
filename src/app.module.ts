import { Module } from '@nestjs/common';
import {AuthModule} from "./modules/auth/auth.module";
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
      AuthModule,
      RedisModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
