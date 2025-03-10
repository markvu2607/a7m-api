export class RegisterResponseDto {
  public tokenType: string;
  public accessToken: string;
  public expiresIn: number;
  public refreshToken: string;

  constructor({
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  }: RegisterResponseDto) {
    this.tokenType = tokenType;
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
    this.refreshToken = refreshToken;
  }
}
