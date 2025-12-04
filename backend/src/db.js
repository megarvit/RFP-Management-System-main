import pg from "pg";
import { config } from "dotenv";

config();
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DB_URL,
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("DB Error:", err));
