import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserJwtDataDto } from '../../modules/auth/dto/user-jwt-data.dto';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'node:fs';
import * as path from 'node:path';

export class JwtPayload extends UserJwtDataDto {
  exp: number;
  iss: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync(path.join(__dirname, `../keys/public.pem`)),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload) {
    return payload as UserJwtDataDto;
  }
}
