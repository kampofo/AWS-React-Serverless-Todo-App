import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const handler = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    // Create tasks table referencing users
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        is_complete BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    console.log("Migration successful.");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Migration completed" }),
    };
  } catch (err) {
    console.error("Migration failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Migration failed" }),
    };
  } finally {
    await client.end();
  }
};
