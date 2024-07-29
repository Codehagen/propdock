import { Env } from "@/env";
import { getRequestHeaders } from "@/lib/poweroffice/auth"


async function superget(env: Env, url: string, workspaceId: string) {
    const poHeaders = await getRequestHeaders(env, workspaceId)

    const response = await fetch(url, {
        method: "GET",
        headers: poHeaders,
    })

    if (!response.ok) {
        throw new Error(`Bad response while fetching ${url}: ${response.status} ${response.statusText}`)
    }

    const res = await response.json()

    return res
}


async function superpost(env: Env, url:string, workspaceId: string, data: any) {
    const poHeaders = await getRequestHeaders(env, workspaceId)

    const response = await fetch(url, {
        method: "GET",
        headers: poHeaders,
        body: data,
    })

    if (!response.ok) {
        throw new Error(`Bad response while posting to ${url}: ${response.status} ${response.statusText}`)
    }

    const res = await response.json()

    return res
}



export {
    superget,
    superpost,
}