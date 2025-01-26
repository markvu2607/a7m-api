import { z } from "zod";

const envVarsSchema = z.object({
  env: z.string(),
  port: z.number(),
  timeout: z.number(),
  web: z.object({
    url: z.string(),
  }),
});

const parsedEnvVars = envVarsSchema.safeParse({
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 9999,
  timeout: Number(process.env.TIMEOUT) || 5000,
  web: {
    url: process.env.WEB_URL || "http://localhost:5173",
  },
});

if (parsedEnvVars.success == false) {
  throw new Error(`
    Config validation error: ${JSON.stringify(
      parsedEnvVars.error.flatten().fieldErrors
    )}
    `);
}

export default parsedEnvVars.data;
