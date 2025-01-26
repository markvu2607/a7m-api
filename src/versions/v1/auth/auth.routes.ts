import { Router } from "express";

import { catchAsync } from "@/shared/utils/catchAsync.util";
import AuthController from "./auth.controller";

const authRouter = Router();

authRouter.get("/login", catchAsync(AuthController.login));

export default authRouter;
