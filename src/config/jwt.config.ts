import * as process from 'node:process';
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  iss: String(process.env.JWT_TOKEN_ISSUER),
  access_ttl: Number(process.env.JWT_ACCESS_TOKEN_TTL),
  refresh_ttl: Number(process.env.JWT_REFRESH_TOKEN_TTL),
}));
