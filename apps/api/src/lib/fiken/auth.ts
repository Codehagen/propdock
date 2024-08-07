import { Env } from "@/env";
import { prisma } from "../../lib/db";
import { getWorkspaceApiKey, getWorkspaceAccessToken, storeWorkspaceAccessToken } from "../localApiKeys";


const FI_ROOT_PROD = "https://api.fiken.no/api/v2"
const FI_AUTH_PROD = "https://fiken.no/oauth/token"

const FI_ROOT = FI_ROOT_PROD
const FI_AUTH = FI_AUTH_PROD

const FI_ONBOARDING_START = `https://fiken.no/oauth/authorize`
const FI_ONBOARDING_FINAL = FI_AUTH


function getOnboardingStartUrl(env: Env) {
    const state = "" // TODO: generate UUID and store somewhere so we can verify when we get the callback
    return `${FI_ONBOARDING_START}?response_type=code&client_id=${env.FI_CLIENT_ID}&redirect_uri=${env.FI_ONBOARD_REDIRECT}&state=${state}`
}


function getOnboardingHeaders(env: Env) {
    const authKeyRaw = `${env.FI_CLIENT_ID}:${env.FI_CLIENT_SECRET}`
    const auth_64    = btoa(authKeyRaw);

    const headers = {
        "Content-Type": "application/json",
        'Authorization': `Basic ${auth_64}`
    }

    return headers
}


async function exchangeCodeForKey(env: Env, code: string, state: string): Promise<Record<string, string | number>> {
    const url = FI_ONBOARDING_FINAL
    const body = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": env.FI_ONBOARD_REDIRECT,
        "state": state,
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const responseData: any = await response.json();
            return responseData
        } else {
            console.error(`Error: ${response.statusText}`);
            throw Error(response.statusText)
        }
    } catch (error: any) {
        console.error(`Network error: ${error.message}`)
        throw error
    }
}


async function getAccessToken(env: Env, workspaceId: string): Promise<string> {
    const db = prisma(env)
    const serviceName = "fiken"

    // Check for token in db
    let accessTokenDb = await getWorkspaceAccessToken(db, workspaceId, serviceName)

    if (accessTokenDb) {
        return accessTokenDb.secret
    }

    // There was no token in db OR the token was not valid anymore, so we continue
    const secret = await getWorkspaceApiKey(env, workspaceId, serviceName) // Fetch the refresh token

    // If the workspace has no secret for this service, throw an error
    if (!secret) {
        throw new Error(`(Workspace:${workspaceId}) Could not find client_secret for service:${serviceName}`)
    }

    // Query for new access token
    let newTokenObject: Record<string, any>
    try {
        newTokenObject = await getNewAccessToken(env, secret)
    } catch(error: any) {
        throw new Error(`(Workspace:${workspaceId}) Could not get new access_token for service:${serviceName} => ${error}`)
    }

    // Save the new access token to db
    storeWorkspaceAccessToken(db, workspaceId, serviceName, newTokenObject.secret, newTokenObject.expiry) 

    // Return the new access token
    return newTokenObject.secret 
}


async function getNewAccessToken(env: Env, client_key: string): Promise<Record<string, string>> {
    const body = new URLSearchParams()
    body.append('grant_type', 'refresh_token')
    body.append('refresh_token', client_key)

    let res: any
    try {
        const response = await fetch(FI_AUTH, {
            method: "POST",
            body: body.toString()
        });

        res = await response.json()

        if (response.status == 400) {
            throw new Error(`${response.status}: ${response.statusText} => ${res.error}: ${res.error_description}`)
        } else if (response.status != 200) {
            throw new Error(`${response.status}: ${response.statusText}`)
        }
    } catch (error: any) {
        console.error(`Error querying Poweroffice auth endpoint: ${error.message}`)
        throw error
    }

    return {"secret": res.access_token, "expiry": res.expires_in}
}


async function getRequestHeaders(env: Env, workspaceId: string) {
    const token = await getAccessToken(env, workspaceId)

    const headers = {
        //'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    return headers
}


export {
    FI_ROOT,
    FI_ONBOARDING_START,
    getOnboardingStartUrl,
    getOnboardingHeaders,
    exchangeCodeForKey,
    getAccessToken,
    getRequestHeaders
}