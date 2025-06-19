import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import jwtConfig from '../../../config/jwt.config';

export const jwtModuleConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule.forFeature(jwtConfig)],
  inject: [jwtConfig.KEY],
  useFactory: (jwtConf: ConfigType<typeof jwtConfig>) => {
    const privateKeyPath = path.resolve(
      __dirname,
      '../../../shared/keys/private.pem',
    );
    const publicKeyPath = path.resolve(
      __dirname,
      '../../../shared/keys/public.pem',
    );

    return {
      privateKey: fs.readFileSync(privateKeyPath, 'utf8'),
      publicKey: fs.readFileSync(publicKeyPath, 'utf8'),
      signOptions: {
        algorithm: 'RS256',
        issuer: jwtConf.iss,
      },
      verifyOptions: {
        algorithms: ['RS256'],
        issuer: jwtConf.iss,
      },
    };
  },
};
