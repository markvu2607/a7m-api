export class LoginResponseDto {
  public tokenType: string;
  public accessToken: string;
  public expiresIn: number;
  public refreshToken: string;

  constructor({
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  }: LoginResponseDto) {
    this.tokenType = tokenType;
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
    this.refreshToken = refreshToken;
  }
}
