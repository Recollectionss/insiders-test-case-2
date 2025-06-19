import {Module} from '@nestjs/common';
import {REDIS_CLIENT} from './redis.constants';
import {createClient} from 'redis';
import {ConfigModule, ConfigService, ConfigType} from '@nestjs/config';
import {RedisService} from './redis.service';
import redisConfig from "../../config/redis.config";

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (config: ConfigType<typeof redisConfig>) => {
        const url = config.url;
        return await createClient({url})
            .on('error', (err) => console.log('Redis Client Error', err))
            .connect();
      },
      inject: [redisConfig.KEY]
    },
    RedisService,
  ],
  exports: [RedisService],
  controllers: [],
  imports: [ConfigModule.forRoot({load: [redisConfig]})],

})
export class RedisModule {}
