import { Env, zEnv } from "./env";
import internal from "./routes/internal";
import external from "./routes/external";
import { honoFactory } from "./lib/hono";


const app = honoFactory();

// Main-level routes
app.route("/api/external", external);
app.route("/api/internal", internal)

export default {
  fetch: (req: Request, env: Env, exCtx: ExecutionContext) => {
    const parsedEnv = zEnv.safeParse(env);

    if (!parsedEnv.success) {
      return Response.json(
        {
          code: "BAD_ENVIRONMENT",
          message: "Some environment variables are missing or are invalid",
          errors: parsedEnv.error,
        },
        { status: 500 },
      );
    }

    return app.fetch(req, parsedEnv.data, exCtx);
  },
};
