import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import AuthService from "./auth.service";

class AuthController {
  static async login(req: Request, res: Response) {
    const rs = await AuthService.login();
    res.status(StatusCodes.OK).json(rs);
  }
}

export default AuthController;
