class JwtTokenAndTTL {
  token: string;
  ttl: number;
}

export class JwtTokensDto {
  refreshToken: JwtTokenAndTTL;
  accessToken: JwtTokenAndTTL;
}

