import { Module } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import { createClient } from 'redis';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { RedisService } from './redis.service';
import redisConfig from '../../config/redis.config';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (config: ConfigType<typeof redisConfig>) => {
        const url = config.url;
        const client = createClient({ url });
        client.on('error', (err) => console.error('Redis Client Error', err));
        await client.connect();
        return client;
      },
      inject: [redisConfig.KEY],
    },
    RedisService,
  ],
  exports: [RedisService],
  controllers: [],
  imports: [ConfigModule.forRoot({ load: [redisConfig] })],
})
export class RedisModule {}
