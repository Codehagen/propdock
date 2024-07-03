import { honoFactory } from "@/lib/hono";
import { getOnboardingHeaders, getOnboardingBody, PO_ONBOARDING_START, exchangeCodeForKey } from "@/lib/poweroffice";
import { saveAPIKey } from "@/models/workspace";


const app = honoFactory();


app.get("/onboarding-start", async (c) => {
    const headers = getOnboardingHeaders()
    const body    = getOnboardingBody()

    const url     = PO_ONBOARDING_START

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const responseData: any = await response.json();
            const temporaryUrl = responseData["TemporaryUrl"];
            return c.json({ ok: true, message: temporaryUrl }, 200);
        } else {
            console.error(`Error: ${response.statusText}`);
            return c.json({ ok: false, message: `Failed to start onboarding`, error: response.statusText }, { status: response.status });
        }
    } catch (error: any) {
        console.error(`Network error: ${error.message}`);
        return c.json({ error: `Network error: ${error.message}` }, 500);
    }
})


app.post("/onboarding-finalize", async(c) => {
    const body = await c.req.json()

    // Get request.body params
    let workspaceId, code, serviceName
    try {
        ({ workspaceId, code, serviceName } = body)
    } catch(error) {
        console.error("Invalid or incomplete `body`")
        return c.json({ ok: false, message: "Request body not in valid format or missing required attributes"}, 400)
    }

    // Exchange the onboarding code for client's key
    let clientKey
    try {
        clientKey = await exchangeCodeForKey(code)

        // Save key to db
        await saveAPIKey(workspaceId, clientKey, serviceName)
    } catch(error) {
        console.error(`Error: ${error}`)
        return c.json({ ok: false, error: error}, 500)
    }

    return c.json({ ok: true }, 200);
})


export const POInternalApp = app