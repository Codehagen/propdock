import { Hono } from "hono";
function honoFactory() {
    const app = new Hono();
    return app;
}
export { honoFactory };
