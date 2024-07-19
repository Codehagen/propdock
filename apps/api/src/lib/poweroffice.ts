import { Env } from "@/env";
import { prisma } from "../lib/db";
import { User } from "@prisma/client";
import { getWorkspaceApiKey, getWorkspaceAccessToken, storeWorkspaceAccessToken } from "./localApiKeys";


const PO_ROOT_DEMO = "https://goapi.poweroffice.net/Demo/v2"
const PO_ROOT_PROD = "https://goapi.poweroffice.net/v2"

const PO_AUTH_DEMO = "https://goapi.poweroffice.net/Demo/OAuth/Token"
const PO_AUTH_PROD = "https://goapi.poweroffice.net/OAuth/Token"

const PO_ROOT = PO_ROOT_DEMO
const PO_AUTH = PO_AUTH_DEMO

const PO_ONBOARDING_START = `${PO_ROOT}/onboarding/initiate`
const PO_ONBOARDING_FINAL = `${PO_ROOT}/onboarding/finalize`


function getOnboardingHeaders(env: Env) {
    const headers = {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": env.PO_SUB_KEY,
        //"ClientOrganizationNo": "",
    }

    return headers
}


function getOnboardingBody(env: Env) {
    const body    = {
        "ApplicationKey": env.PO_APP_KEY,
        "RedirectUri"   : env.PO_ONBOARD_REDIRECT,
    }

    return body
}


async function exchangeCodeForKey(env: Env, code: string): Promise<string> {
    const url = PO_ONBOARDING_FINAL
    const headers = getOnboardingHeaders(env)
    const body = {
        "OnboardingToken": code,
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const responseData: any = await response.json();
            const key = responseData["OnboardedClientsInformation"][0]["ClientKey"];
            return key
        } else {
            console.error(`Error: ${response.statusText}`);
            throw Error(response.statusText)
        }
    } catch (error: any) {
        console.error(`Network error: ${error.message}`)
        throw error
    }
}


function getAuthHeaders(env: Env, client_key: string) {
    const authKeyRaw = `${env.PO_APP_KEY}:${client_key}`
    const auth_64    = btoa(authKeyRaw);

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Ocp-Apim-Subscription-Key": env.PO_SUB_KEY,
        'Authorization': `Basic ${auth_64}`
    }

    return headers
}


async function getAccessToken(env: Env, workspaceId: string): Promise<string> {
    const db = prisma(env)
    const serviceName = "poweroffice"

    // Check for token in db
    let accessTokenDb = await getWorkspaceAccessToken(db, workspaceId, serviceName)

    if (accessTokenDb) {
        return accessTokenDb.secret
    }

    // There was no token in db OR the token was not valid anymore, so we continue
    const secret = await getWorkspaceApiKey(env, workspaceId, serviceName) // Fetch the workspace's secret

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
    const headers = getAuthHeaders(env, client_key)
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');

    let res: any
    try {
        const response = await fetch(PO_AUTH, {
            method: "POST",
            headers: headers,
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
        'Content-Type': 'application/json',
        "Ocp-Apim-Subscription-Key": env.PO_SUB_KEY,
        'Authorization': `Bearer ${token}`
    }

    return headers
}


export {
    getOnboardingHeaders,
    getOnboardingBody,
    getAuthHeaders,
    PO_ONBOARDING_START,
    exchangeCodeForKey,
    getAccessToken,
    getRequestHeaders
}