export const TOKEN_SCHEMES = {
  BEARER: 'Bearer',
  DPOP: 'DPoP',
} as const;

export type TokenScheme = (typeof TOKEN_SCHEMES)[keyof typeof TOKEN_SCHEMES];
