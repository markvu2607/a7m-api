export class LoginResponseDto {
  public tokenType: string;
  public accessToken: string;
  public refreshToken: string;
  public expiresIn: number;

  constructor({
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  }: LoginResponseDto) {
    this.tokenType = tokenType;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
  }
}
