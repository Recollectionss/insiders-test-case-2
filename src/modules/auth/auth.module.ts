import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthJwtService } from './jwt/auth-jwt.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleConfig } from './config/jwt.module.config';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt/bcrypt.service';
import { JwtStrategy } from '../../shared/strategy/jwt.strategy';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthJwtService,
    { provide: HashingService, useClass: BcryptService },
    JwtStrategy,
  ],
  imports: [
    ConfigModule.forRoot({ load: [jwtConfig] }),
    JwtModule.registerAsync(jwtModuleConfig),
    UserModule,
    RedisModule,
  ],
})
export class AuthModule {}
