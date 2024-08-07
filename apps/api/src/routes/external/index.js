import authMiddleware from "./authMiddleware";
import users from "../../routes/users";
import { honoFactory } from "../../lib/hono";
import { properties } from "./properties";
import { buildings } from "./buildings";
const external = honoFactory();
external.use(authMiddleware);
// Routes
external.all('/test', (c) => {
    return c.text('GET /api/external/test 200');
});
external.route("/users", users);
external.route("/properties", properties);
external.route("/buildings", buildings);
export default external;
