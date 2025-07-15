import { handler } from "../../src/handlers/tasks/deleteTask";

(async () => {
  const res = await handler(
    {
      pathParameters: {
        id: "1", // 👈 change this to an existing task ID you want to delete
      },
    } as any,
    {} as any,
    () => {}
  );

  console.log("Lambda Result (deleteTask):", res);
})();
