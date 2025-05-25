import { Response } from "express";

export const cookieService = {
  clearRefreshTokenCookie(res: Response) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      path: "/",
    });
  },
};
