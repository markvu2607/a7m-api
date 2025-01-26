import morgan from "morgan";
import type { Request, Response } from "express";

import envVars from "@/config/envVars";
import logger from "@/config/logger";

morgan.token(
  "message",
  (req: Request, res: Response) => res.locals.errorMessage || ""
);

const getIpFormat = () => (envVars.env === "production" ? ":remote-addr" : "");
const successResponseFormat = `${getIpFormat()} - :method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()} - :method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

export default {
  successHandler,
  errorHandler,
};
