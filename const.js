import { config } from "dotenv";

config({
  override: true,
});

export const db_username = process.env.db_username;
export const db_password = process.env.db_password;
export const PORT = 8080 || process.env.PORT;
