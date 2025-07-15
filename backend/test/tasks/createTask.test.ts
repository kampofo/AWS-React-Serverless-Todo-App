import { handler } from "../../src/handlers/tasks/createTask";

(async () => {
  const result = await handler(
    {
      body: JSON.stringify({ description: "Test task from local runner" }),
    } as any,
    {} as any,
    () => {}
  );

  console.log("Lambda Result:", result);
})();
