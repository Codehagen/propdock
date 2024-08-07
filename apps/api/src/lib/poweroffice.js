import { getRequestHeaders } from "@/lib/poweroffice/auth";
async function superget(env, url, workspaceId) {
    const poHeaders = await getRequestHeaders(env, workspaceId);
    const response = await fetch(url, {
        method: "GET",
        headers: poHeaders,
    });
    if (!response.ok) {
        throw new Error(`Bad response while fetching ${url}: ${response.status} ${response.statusText}`);
    }
    const res = await response.json();
    return res;
}
async function superpost(env, url, workspaceId, data) {
    const poHeaders = await getRequestHeaders(env, workspaceId);
    let response;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: poHeaders,
            body: JSON.stringify(data),
        });
    }
    catch (error) {
        console.error("Superpost error:", error);
        return;
    }
    if (!response.ok) {
        console.error(`Bad response while posting to ${url}: ${response.status} ${response.statusText} ${await response.text()}`);
        throw new Error(`Bad response while posting to ${url}: ${response.status} ${response.statusText}`);
    }
    const res = await response.json();
    return res;
}
export { superget, superpost, };