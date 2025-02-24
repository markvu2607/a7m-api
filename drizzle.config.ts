import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import envVars from "@/config/envVars";

export default defineConfig({
  out: "./migrations",
  schema: "./src/db/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: envVars.db.url,
  },
});
