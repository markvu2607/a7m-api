import type { Request, Response, NextFunction } from "express";

export const catchAsync =
  (fn: (req: Request, res: Response) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch((err) => next(err));
  };
