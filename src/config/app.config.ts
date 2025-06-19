import { registerAs } from '@nestjs/config';
import * as process from 'node:process';
import { ENV } from '../constants/env.constants';

export default registerAs('app', () => ({
  node_env: process.env.NODE_ENV as ENV,
  port: process.env.PORT,
}));
