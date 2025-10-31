import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
});

pool.query("SELECT NOW()", (err, res) => {
    if (err) console.error("шибка подключения к PostgreSQL:", err.message);
    else console.log("Подключено к PostgreSQL:", res.rows[0].now);
});
