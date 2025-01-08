import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api");

app.use(logger()); // TODO: add custom logger

app.get("/", (c) => {
  return c.json({
    message: "Hello, World!",
  });
});

export default {
  port: 9999,
  fetch: app.fetch,
};
