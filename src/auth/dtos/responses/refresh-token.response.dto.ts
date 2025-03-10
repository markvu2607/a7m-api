export class RefreshTokenResponseDto {
  public tokenType: string;
  public accessToken: string;
  public refreshToken: string;
  public expiresIn: number;

  constructor({
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  }: RefreshTokenResponseDto) {
    this.tokenType = tokenType;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
  }
}
