import { APIGatewayProxyHandler } from "aws-lambda";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config(); // Loads .env in local dev

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { description } = JSON.parse(event.body || "{}");

    if (!description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Description is required" }),
      };
    }

    const client = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 5432,
      ssl: {
        rejectUnauthorized: false, // <-- disables cert validation, fine for testing
      },
    });

    await client.connect();

    const result = await client.query(
      "INSERT INTO tasks (description, is_complete) VALUES ($1, false) RETURNING *",
      [description]
    );

    await client.end();

    return {
      statusCode: 201,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
