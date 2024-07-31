import { v4 as uuidv4 } from "uuid"

import { Env } from "@/env"
import { honoFactory } from "@/lib/hono"
import { ESigningClient } from "@/lib/signicat"

const app = honoFactory()

app.post("/create-document", async (c) => {
  const env = c.env as Env

  try {
    const accessToken = await getAccessToken(env)

    const documentData = {
      title: "As simple as that",
      description: "This is an important document",
      externalId: uuidv4(),
      dataToSign: {
        base64Content:
          "JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDM...",
        fileName: "sample.txt",
      },
      contactDetails: {
        email: "test@test.com",
      },
      signers: [
        {
          externalSignerId: uuidv4(),
          redirectSettings: {
            redirectMode: "donot_redirect",
          },
          signatureType: {
            mechanism: "pkisignature",
          },
          signerInfo: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            mobile: {
              countryCode: "+47",
              number: "98453571",
            },
          },
        },
      ],
    }

    const response = await fetch(
      "https://api.signicat.com/express/sign/documents",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentData),
      },
    )

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(
        `Failed to create document. Status: ${response.status}, Body: ${errorBody}`,
      )
      return c.json(
        {
          ok: false,
          message: `Failed to create document: ${response.statusText}`,
        },
        500,
      )
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

app.post("/initialize", async (c) => {
  const env = c.env as Env
  const signicatClient = new ESigningClient(
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

app.get("/documents/:documentId/status", async (c) => {
  const env = c.env as Env
  const documentId = c.req.param("documentId")

  try {
    const accessToken = await getAccessToken(env)

    const response = await fetch(
      `https://api.signicat.com/express/sign/documents/${documentId}/summary`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(
        `Failed to retrieve document status. Status: ${response.status}, Body: ${errorBody}`,
      )
      return c.json(
        {
          ok: false,
          message: `Failed to retrieve document status: ${response.statusText}`,
        },
        response,
      )
    }

    const documentStatus = await response.json()

    return c.json({
      ok: true,
      message: "Document status retrieved successfully",
      status: documentStatus,
    })
  } catch (error) {
    console.error("Failed to retrieve document status:", error)
    return c.json(
      {
        ok: false,
        message: "Failed to retrieve document status",
        error: error,
      },
      500,
    )
  }
})

app.get("/documents/:documentId/files", async (c) => {
  const env = c.env as Env
  const documentId = c.req.param("documentId")
  const fileFormat = c.req.query("fileFormat") as
    | "unsigned"
    | "native"
    | "standard_packaging"
    | "pades"
    | "xades"
    | undefined
  const originalFileName = c.req.query("originalFileName") === "true"

  try {
    const accessToken = await getAccessToken(env)

    const url = new URL(
      `https://api.signicat.com/express/sign/documents/${documentId}/files`,
    )
    if (fileFormat) url.searchParams.append("fileFormat", fileFormat)
    if (originalFileName) url.searchParams.append("originalFileName", "true")

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(
        `Failed to retrieve document file. Status: ${response.status}, Body: ${errorBody}`,
      )
      return c.json(
        {
          ok: false,
          message: `Failed to retrieve document file: ${response.statusText}`,
        },
        response,
      )
    }

    const fileContent = await response.arrayBuffer()
    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream"

    return new Response(fileContent, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${documentId}.${contentType.split("/")[1]}"`,
      },
    })
  } catch (error) {
    console.error("Failed to retrieve document file:", error)
    return c.json(
      { ok: false, message: "Failed to retrieve document file", error: error },
      500,
    )
  }
})

app.post("/documents/:documentId/attachments", async (c) => {
  const env = c.env as Env
  const documentId = c.req.param("documentId")

  try {
    const accessToken = await getAccessToken(env)

    const body = await c.req.json()
    const attachmentData = {
      fileName: body.fileName,
      title: body.title,
      data: body.data,
      convertToPdf: body.convertToPdf,
      signers: body.signers,
      description: body.description,
      type: body.type,
    }

    const response = await fetch(
      `https://api.signicat.com/express/sign/documents/${documentId}/attachments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attachmentData),
      },
    )

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(
        `Failed to create attachment. Status: ${response.status}, Body: ${errorBody}`,
      )
      return c.json(
        {
          ok: false,
          message: `Failed to create attachment: ${response.statusText}`,
        },
        response,
      )
    }

    const createdAttachment = await response.json()

    return c.json(
      {
        ok: true,
        message: "Attachment created successfully",
        attachment: createdAttachment,
      },
      201,
    )
  } catch (error) {
    console.error("Failed to create attachment:", error)
    return c.json(
      { ok: false, message: "Failed to create attachment", error: error },
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

export const ESignApp = app
