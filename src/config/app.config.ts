import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('app', () => ({
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
}));
