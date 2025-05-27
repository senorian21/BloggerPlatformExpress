import { Response } from "express";

export const cookieService = {
  setRefreshTokenCookie(res: Response, token: string) {
    res.setHeader('Set-Cookie', [
      `refreshToken=${token}; HttpOnly; Secure; Path=/; Max-Age=20`,
    ]);
  },

  clearRefreshTokenCookie(res: Response) {
    res.setHeader('Set-Cookie', [
      'refreshToken=; HttpOnly; Secure; Path=/; Max-Age=0',
    ]);
  },
};
