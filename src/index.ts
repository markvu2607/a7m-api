import app from "@/app";
import envVars from "@/config/envVars";
import logger from "@/config/logger";

const server = app.listen(envVars.port, () => {
  console.log(`Server is running on ${envVars.port}`);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
  });
});
