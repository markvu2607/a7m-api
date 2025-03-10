export class RegisterResponseDto {
  public tokenType: string;
  public accessToken: string;
  public refreshToken: string;
  public expiresIn: number;

  constructor({
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  }: RegisterResponseDto) {
    this.tokenType = tokenType;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
  }
}
