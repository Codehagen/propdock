const PO_ROOT_DEMO = "https://goapi.poweroffice.net/Demo/v2";
const PO_ROOT_PROD = "https://goapi.poweroffice.net/v2";
const PO_ROOT = PO_ROOT_DEMO;
const PO_ONBOARDING_START = `${PO_ROOT}/onboarding/initiate`;
const PO_ONBOARDING_FINAL = `${PO_ROOT}/onboarding/finalize`;
function getOnboardingHeaders(env) {
    const headers = {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": env.PO_SUB_KEY,
        //"ClientOrganizationNo": "",
    };
    return headers;
}
function getOnboardingBody(env) {
    const body = {
        "ApplicationKey": env.PO_APP_KEY,
        "RedirectUri": env.PO_ONBOARD_REDIRECT,
        //"RedirectUri"   : "localhost:8787/api/internal/oauth/poweroffice/callback-test"
    };
    return body;
}
async function exchangeCodeForKey(env, code) {
    const url = PO_ONBOARDING_FINAL;
    const headers = getOnboardingHeaders(env);
    const body = {
        "OnboardingToken": code,
    };
    console.log("Exchanging key:", code);
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const responseData = await response.json();
            const key = responseData["OnboardedClientsInformation"][0]["ClientKey"];
            console.log("Exchange successful!");
            return key;
        }
        else {
            console.error(`Error: ${response.statusText}`);
            throw Error(response.statusText);
        }
    }
    catch (error) {
        console.error(`Network error: ${error.message}`);
        throw error;
    }
}
function getAuthHeaders(env, client_key) {
    const authKey = `${env.PO_APP_KEY}:${client_key}`;
    const auth_64 = btoa(authKey);
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Ocp-Apim-Subscription-Key": env.PO_SUB_KEY,
        'Authorization': `Basic ${auth_64}`
    };
    return headers;
}
export { getOnboardingHeaders, getOnboardingBody, getAuthHeaders, PO_ONBOARDING_START, exchangeCodeForKey, };
