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

    const { description, is_complete } = JSON.parse(event.body || "{}");

    if (description === undefined && is_complete === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No update fields provided" }),
      };
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (description !== undefined) {
      updates.push("description = $" + (updates.length + 1));
      values.push(description);
    }

    if (is_complete !== undefined) {
      updates.push("is_complete = $" + (updates.length + 1));
      values.push(is_complete);
    }

    values.push(taskId);

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
      `UPDATE tasks SET ${updates.join(", ")} WHERE id = $${
        values.length
      } RETURNING *`,
      values
    );

    await client.end();

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Task not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (error) {
    console.error("Error updating task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
