import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Request, Response } from 'express';
import { RefreshToken } from './decorators/refresh-token/refresh-token.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 202, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('sign-up')
  async signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @ApiOperation({ summary: 'Sign in user and return access token' })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in, access token returned',
  })
  @ApiResponse({ status: 400, description: 'Invalid email or password' })
  @ApiBody({ type: SignInDto })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() data: SignInDto, @Res() res: Response) {
    return this.authService.signIn(data, res);
  }

  @ApiOperation({ summary: 'Log out user and clear refresh token cookie' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @Patch('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }

  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Access token successfully refreshed',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @Patch('refresh')
  async refresh(@RefreshToken() refreshToken: string, @Res() res: Response) {
    return this.authService.refresh(refreshToken, res);
  }
}
