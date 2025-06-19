import * as process from 'node:process';
import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  port: Number(process.env.POSTGRES_PORT),
  host: String(process.env.POSTGRES_HOST),
  db: String(process.env.POSTGRES_DB),
  user: String(process.env.POSTGRES_APP_USER),
  pass: String(process.env.POSTGRES_APP_PASSWORD),
  testing: {
    schema: 'test',
  },
  development: {
    schema: 'test',
  },
  production: {
    schema: 'public',
  },
}));
