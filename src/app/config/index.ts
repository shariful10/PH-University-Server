import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  defaultPassword: process.env.DEFAULT_PASS,
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
};