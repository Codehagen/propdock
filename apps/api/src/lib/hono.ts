import { Hono } from "hono";
import { Env } from "../env";
import { CustomContext } from "../types";


function honoFactory() {
    const app = new Hono<{
        Bindings: Env;
        Variables: CustomContext;
    }>();
    
    return app
}


export {
    honoFactory
}