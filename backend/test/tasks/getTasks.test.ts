import { handler } from "../../src/handlers/tasks/getTasks";

(async () => {
  const res = await handler(
    {} as any, // no event body needed
    {} as any,
    () => {}
  );

  console.log("Lambda Result (getTasks):", res);
})();
