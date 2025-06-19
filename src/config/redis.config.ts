import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('redis', () => ({
  url: process.env.REDIS_URL,
}))