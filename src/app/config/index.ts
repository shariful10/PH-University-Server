import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
};
