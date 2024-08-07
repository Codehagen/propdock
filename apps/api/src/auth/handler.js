import { verifyKey } from '@unkey/api';
const DEBUG = false; // NB! Change to false before committing.
const FE_KEY = "super-secret"; // TODO: get from wrangler.toml
export async function verifyApiKey(key, dummy = false) {
    if (DEBUG) {
        console.debug("Middleware debug - processing key:", key);
    }
    if (dummy) {
        const res = false;
        if (DEBUG) {
            console.debug("Middleware debug - returning API verified as:", res);
        }
        return res;
    }
    const { result, error } = await verifyKey(key);
    if (DEBUG) {
        console.debug("Middleware debug - verify-key results:", result?.code, result?.valid);
    }
    if (result) {
        return result.valid;
    }
    else if (error) {
        console.error("Couldn't verify key:", error.code, error.message);
    }
    return false;
}
export async function verifyFrontend(pass) {
    if (DEBUG) {
        console.debug("Middleware debug - processing pass:", pass);
    }
    const res = (pass == FE_KEY);
    if (DEBUG) {
        console.debug("Middleware debug - returning API verified as:", res);
    }
    return res;
}
