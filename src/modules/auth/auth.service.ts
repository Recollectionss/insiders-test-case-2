import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { HashingService } from './hashing/hashing.service';
import { AuthJwtService } from './jwt/auth-jwt.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Request, Response } from 'express';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly authJwtService: AuthJwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConf: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(data: SignUpDto): Promise<void> {
    data.password = await this.hashingService.setHash(data.password);
    await this.userService.create(data as CreateUserDto);
    return;
  }

  async signIn(data: SignInDto, res: Response): Promise<Response> {
    const dataValues = await this.userService.findByEmail(data.email);
    if (
      !(await this.hashingService.compareHash(
        data.password,
        dataValues.password,
      ))
    ) {
      throw new BadRequestException('Invalid password');
    }
    const tokens = this.authJwtService.generateTokens({ sub: dataValues.id });
    res = this.setTokenInCookie(res, tokens.refreshToken);
    return res.status(HttpStatus.OK).json({
      accessToken: tokens.accessToken,
    });
  }

  async logout(req: Request, res: Response): Promise<Response> {
    const refreshToken = await this.getTokenFromCookies(req);

    if (typeof refreshToken === 'undefined') {
      return res.status(HttpStatus.OK).json({});
    }
    res.clearCookie('refreshToken');
    return res.status(HttpStatus.OK).json({});
  }

  async refresh(refreshToken: string, res: Response): Promise<Response> {
    console.log('refreshToken', refreshToken);
    const tokenData = await this.authJwtService.decode(refreshToken);
    console.log('refreshToken', refreshToken);
    await this.userService.findById(tokenData);
    const tokens = this.authJwtService.generateTokens({ sub: tokenData.sub });
    res = this.setTokenInCookie(res, tokens.refreshToken);
    return res.status(HttpStatus.OK).json({ accessToken: tokens.accessToken });
  }

  private setTokenInCookie(res: Response, refreshToken: string): Response {
    return res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: this.jwtConf.refresh_ttl,
    });
  }

  private async getTokenFromCookies(req: Request): Promise<string | undefined> {
    return req.cookies?.refreshToken;
  }
}
