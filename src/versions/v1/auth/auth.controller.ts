import type { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import AuthService from "./auth.service";
import ApiResponse from "@/shared/utils/ApiResponse.util";

class AuthController {
  static async login(req: Request, res: Response) {
    const rs = await AuthService.login();

    res.status(StatusCodes.OK).json(
      new ApiResponse<{ username: string; password: string }>({
        status: "success",
        statusCode: StatusCodes.OK,
        message: ReasonPhrases.OK,
        data: rs,
      })
    );
  }
}

export default AuthController;
