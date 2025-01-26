import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import envVars from "@/config/envVars";
import logger from "@/config/logger";
import ApiError from "@/shared/utils/ApiError.util";

export const errorConverter = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || ReasonPhrases.INTERNAL_SERVER_ERROR;

    error = new ApiError(statusCode, message);
  }

  next(error);
};

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { statusCode, message } = err;

  res.locals.errorMessage = message;

  const response = {
    statusCode,
    message,
    ...(envVars.env === "development" && { stack: err.stack }),
  };

  if (envVars.env === "development") {
    logger.error(err);
  }

  res.status(statusCode).json(response);
  next();
};
