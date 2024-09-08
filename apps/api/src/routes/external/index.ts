import { honoFactory } from "../../lib/hono";
import users from "../../routes/users";
import authMiddleware from "./authMiddleware";
import { buildings } from "./buildings";
import { properties } from "./properties";

const external = honoFactory();

external.use(authMiddleware);

// Routes
external.all("/test", (c) => {
  return c.text("GET /api/external/test 200");
});

external.route("/users", users);
external.route("/properties", properties);
external.route("/buildings", buildings);

export default external;
