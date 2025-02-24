import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import envVars from "@/config/envVars";
import morgan from "@/config/morgan";
import { errorConverter, errorHandler } from "@/middlewares/error.middleware";
import ApiError from "@/shared/utils/ApiError.util";
import ApiResponse from "@/shared/utils/ApiResponse.util";
import v1Router from "@/versions/v1/v1.routes";

const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(helmet());
app.use(
  cors({
    origin: ["*", envVars.web.url],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

app.get("/health-check", async (req, res) => {
  res.status(StatusCodes.OK).json(
    new ApiResponse({
      status: "success",
      statusCode: StatusCodes.OK,
      message: ReasonPhrases.OK,
    })
  );
});

app.use("/v1", v1Router);

app.use((req, res, next) => {
  next(
    new ApiError({
      statusCode: StatusCodes.NOT_FOUND,
      message: ReasonPhrases.NOT_FOUND,
    })
  );
});

app.use(errorConverter);
app.use(errorHandler);

export default app;
