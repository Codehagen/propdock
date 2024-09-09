import { Hono } from "hono";
import type { Env } from "../env";
import type { CustomContext } from "../types";

function honoFactory() {
  const app = new Hono<{
    Bindings: Env;
    Variables: CustomContext;
  }>();

  return app;
}

export { honoFactory };
