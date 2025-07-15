import { APIGatewayProxyHandler } from "aws-lambda";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const client = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await client.connect();

    const result = await client.query("SELECT * FROM tasks ORDER BY id ASC");

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows),
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
