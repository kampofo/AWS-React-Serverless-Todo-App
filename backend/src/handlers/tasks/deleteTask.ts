import { APIGatewayProxyHandler } from "aws-lambda";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const taskId = event.pathParameters?.id;

    if (!taskId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Task ID is required in path" }),
      };
    }

    const client = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await client.connect();

    const result = await client.query("DELETE FROM tasks WHERE id = $1", [
      taskId,
    ]);

    await client.end();

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Task not found" }),
      };
    }

    return {
      statusCode: 204,
      body: "",
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
