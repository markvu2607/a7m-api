import { drizzle } from "drizzle-orm/node-postgres";

import envVars from "@/config/envVars";

const db = drizzle(envVars.db.url);

export default db;
