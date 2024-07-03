const PO_ROOT_DEMO = "https://goapi.poweroffice.net/Demo/v2"
const PO_ROOT_PROD = "https://goapi.poweroffice.net/v2"

const PO_ROOT = PO_ROOT_DEMO

const PO_ONBOARDING_START = `${PO_ROOT}/onboarding/initiate`
const PO_ONBOARDING_FINAL = `${PO_ROOT}/onboarding/finalize`


const SUB_KEY = ""
const APP_KEY = ""

const PO_ONBOARD_REDIRECT = "" // url for redirect after onboarding

// TODO: put all these in .env/.toml


function getOnboardingHeaders() {
    const headers = {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": SUB_KEY,
    }

    return headers
}


function getOnboardingBody() {
    const body    = {
        "ApplicationKey": APP_KEY,
        "RedirectUri"   : PO_ONBOARD_REDIRECT,
    }

    return body
}


async function exchangeCodeForKey(code: string): Promise<string> {
    const url = PO_ONBOARDING_FINAL
    const headers = getOnboardingHeaders()
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


function getAuthHeaders(client_key: string) {
    const authKey = `${APP_KEY}:${client_key}`
    const auth_64 = btoa(authKey);

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Ocp-Apim-Subscription-Key": SUB_KEY,
        'Authorization': `Basic ${auth_64}`
    }

    return headers
}


export {
    getOnboardingHeaders,
    getOnboardingBody,
    getAuthHeaders,
    PO_ONBOARDING_START,
    exchangeCodeForKey,
}