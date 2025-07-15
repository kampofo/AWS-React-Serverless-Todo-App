import { handler } from "../../src/handlers/tasks/updateTask";

(async () => {
  const res = await handler(
    {
      pathParameters: {
        id: "1", // 👈 change this to an existing task ID
      },
      body: JSON.stringify({
        description: "Updated description",
        is_complete: true,
      }),
    } as any,
    {} as any,
    () => {}
  );

  console.log("Lambda Result (updateTask):", res);
})();
