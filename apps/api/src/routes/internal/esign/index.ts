import { Env } from "@/env"
import { honoFactory } from "@/lib/hono"
import { SignicatClient } from "@/lib/signicat"

const app = honoFactory()

app.post("/initialize", async (c) => {
  const env = c.env as Env
  const signicatClient = new SignicatClient(
    env.SIGNICAT_CLIENT_ID,
    env.SIGNICAT_CLIENT_SECRET,
  )

  try {
    const accessToken = await getAccessToken(env)
    return c.json({
      ok: true,
      message: "Signicat client initialized successfully",
      accessToken,
    })
  } catch (error) {
    console.error("Failed to initialize Signicat client:", error)
    return c.json(
      { ok: false, message: "Failed to initialize Signicat client" },
      500,
    )
  }
})

async function getAccessToken(env: Env): Promise<string> {
  const credentials = btoa(
    `${env.SIGNICAT_CLIENT_ID}:${env.SIGNICAT_CLIENT_SECRET}`,
  )

  const response = await fetch(
    "https://api.signicat.com/auth/open/connect/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "signicat-api",
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to obtain access token: ${response.statusText}`)
  }
  const data = (await response.json()) as { access_token: string }
  return data.access_token
}

app.post("/create-document", async (c) => {
  const env = c.env as Env

  try {
    const accessToken = await getAccessToken(env)

    const documentData = {
      title: "As simple as that",
      description: "This is an important document",
      externalId: "ae7b9ca7-3839-4e0d-a070-9f14bffbbf55",
      dataToSign: {
        base64Content: "VGhpcyB0ZXh0IGNhbiBzYWZlbHkgYmUgc2lnbmVk",
        fileName: "sample.txt",
      },
      contactDetails: {
        email: "test@test.com",
      },
      signers: [
        {
          externalSignerId: "uoiahsd321982983jhrmnec2wsadm32",
          redirectSettings: {
            redirectMode: "donot_redirect",
          },
          signatureType: {
            mechanism: "pkisignature",
          },
        },
      ],
    }

    const response = await fetch("https://api.signicat.com/sign/v1/documents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentData),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(
        `Failed to create document. Status: ${response.status}, Body: ${errorBody}`,
      )
      throw new Error(`Failed to create document: ${response.statusText}`)
    }

    const createdDocument = await response.json()
    return c.json({
      ok: true,
      message: "Document created successfully",
      document: createdDocument,
    })
  } catch (error) {
    console.error("Failed to create document:", error)
    return c.json(
      { ok: false, message: "Failed to create document", error: error },
      500,
    )
  }
})

export const ESignApp = app
