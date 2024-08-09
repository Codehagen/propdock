import { prisma } from "../../lib/db";
import { verifyApiKey } from "../../auth/handler";
//const ENV_DEBUG: string | undefined = process.env?.DEBUG_MODE; // TODO: investigate if this can be made to work with wrangler
const DEBUG = false; // NB! Change to false before committing.
// Routes that should be exempt from auth entirely
const AUTH_EXCEPT_ROUTES = [
    ['/api/users', 'POST'],
    ['/api/external/esign/webhook', "*"]
];
// Routes that need auth but not a user
const AUTH_WITHOUT_USER_ROUTES = [];
// Routes that need auth and a user, but not a workspace
const AUTH_WITHOUT_WORKSPACE_ROUTES = [];
function isExceptedRoute(route_list, path, method) {
    return route_list.some(([routePath, routeMethod]) => {
        const pathMatch = routePath.endsWith('/') ?
            path.startsWith(routePath) : path === routePath;
        return pathMatch && (routeMethod === '*' || routeMethod === method);
    });
}
export default async function authMiddleware(c, next) {
    // Skip all checks for the test endpoint
    if (c.req.path === '/api/external/test') {
        if (DEBUG) {
            console.debug("Middleware debug - inserting test variable into request context");
        }
        c.set("test", true);
        return next();
    }
    // Skip ALL API checks for select routes
    if (isExceptedRoute(AUTH_EXCEPT_ROUTES, c.req.path, c.req.method)) {
        return next();
    }
    // Extract API key from headers & verify that it exists
    const apiKey = c.req.header("x-api-key");
    if (DEBUG) {
        console.debug("Middleware debug - API key header:", apiKey);
    }
    if (!apiKey) {
        return c.json({ ok: false, message: "API key is required" }, 400);
    }
    // Verify API key
    const apiKeyVerified = await verifyApiKey(apiKey);
    if (DEBUG) {
        console.debug("Middleware debug - API key was verified:", apiKeyVerified);
    }
    if (!apiKeyVerified) {
        return c.json({ ok: false, message: "Invalid API key" }, 401);
    }
    // Paths that require an API key but not a user
    if (isExceptedRoute(AUTH_WITHOUT_USER_ROUTES, c.req.path, c.req.method)) {
        return next();
    }
    // User look-up
    const res = await prisma(c.env).userApiKey.findUnique({
        where: { secret: apiKey },
        include: { user: true }
    });
    if (!res) {
        return c.json({ ok: false, message: "API key did not exist" }, 401);
    }
    const user = res.user;
    if (DEBUG) {
        console.debug("Middleware debug - user:", user.id, user.email, user.workspaceId);
    }
    if (!user) {
        return c.json({ ok: false, message: "User did not exist" }, 401);
    }
    // Insert the user object into request context
    c.set("user", user);
    // Paths that require a user but not a workspace
    if (isExceptedRoute(AUTH_WITHOUT_WORKSPACE_ROUTES, c.req.path, c.req.method)) {
        return next();
    }
    // Require the user to have a workspace before giving access
    const workspaceId = user.workspaceId;
    if (workspaceId == null || workspaceId == undefined) {
        return c.json({ ok: false, message: "You must belong to a workspace in order to access this endpoint." }, 400);
    }
    // Proceed to the route handler
    return next();
}
