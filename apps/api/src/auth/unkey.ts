// const UNKEY_ROOT = process.env.UNKEY_ROOT
// const API_ID     = process.env.UNKEY_API_ID

async function createAPIKey(
  rk: string,
  aId: string,
  workspaceId: string,
  serviceName = "",
  prefix = "",
): Promise<string | null> {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${rk}`,
      "Content-Type": "application/json",
    },
    body: `
            {"apiId":${aId},
            "prefix":${prefix},
            "ownerId":${workspaceId},
            "name":${serviceName},
            "meta":{
                "ratelimit":{
                    "type":"fast",
                    "limit":10,
                    "duration":60000
                },
                "enabled":true,
            }`,
  };

  try {
    const res = await fetch("https://api.unkey.dev/v1/keys.createKey", options);
    const result = (await res.json()) as any;
    console.debug(
      `Tried to create API key for workspace <${workspaceId}>, returned with status <${res.status}>`,
    );
    return result.key;
  } catch (error: any) {
    console.error(`${error.code}: ${error.message}`);
    return null;
  }
}

export { createAPIKey };

{
  /*
body: `
{"apiId":${API_ID},
"prefix":"<string>",
"name":"my key",
"byteLength":135,
"ownerId":"team_123",
"meta":{
    "billingTier":"PRO",
    "trialEnds":"2023-06-16T17:16:37.161Z"},
    "roles":[
        "admin",
        "finance"
    ],
    "permissions":[
        "domains.create_record",
        "say_hello"
    ],
    "expires":1623869797161,
    "remaining":1000,
    "refill":{
        "interval":"daily",
        "amount":100
    },
    "ratelimit":{
        "type":"fast",
        "limit":10,
        "duration":60000
    },
    "enabled":true,
    "environment":"<string>"
}`
*/
}
