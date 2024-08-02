import { v4 as uuidv4 } from "uuid"

import { Env } from "@/env"
import { prisma } from "@/lib/db"
import { honoFactory } from "@/lib/hono"
import { getProxyUrl, storeSignedDocument } from "@/lib/R2-storage"
import { ESigningClient } from "@/lib/signicat"

const app = honoFactory()

app.post("/create-document", async (c) => {
  const env = c.env as Env

  try {
    const accessToken = await getAccessToken(env)

    const body = await c.req.json()
    const documentData = {
      title: body.title,
      description: body.description,
      externalId: uuidv4(),
      dataToSign: {
        base64Content: btoa(body.content),
        fileName: body.fileName,
      },
      contactDetails: {
        email: "post@propdock.no",
      },
      notification: {
        signRequest: {
          sms: [
            {
              language: "NO",
              text:
                body.smsText ||
                "Vennligst signer dokumentet '{document-title}'. Du kan signere det her: {url}",
            },
          ],
        },
        webhook: {
          url: "https://api.propdock.workers.dev/api/internal/esign/webhook",
          events: ["order.completed", "order.expired", "document.signed"],
        },
      },
      signers: body.signers.map((signer: any) => ({
        externalSignerId: uuidv4(),
        redirectSettings: {
          redirectMode: "donot_redirect",
        },
        signatureType: {
          mechanism: "pkisignature",
        },
        signerInfo: {
          firstName: signer.firstName,
          lastName: signer.lastName,
          email: signer.email,
          mobile: signer.mobile,
        },
        notifications: {
          setup: {
            request: "sendBoth",
            signatureReceipt: "sendSms",
            finalReceipt: "off",
          },
          signerInfo: {
            mobile: {
              countryCode: signer.mobile.countryCode,
              number: signer.mobile.number,
            },
            email: signer.email,
          },
        },
      })),
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

app.post("/webhook", async (c) => {
  console.log("Webhook received")

  try {
    const body = await c.req.json()
    console.log("Webhook body:", JSON.stringify(body, null, 2))

    if (!body.eventName || !body.eventData) {
      console.error("Invalid webhook payload: missing eventName or eventData")
      return c.json({ ok: false, message: "Invalid webhook payload" }, 400)
    }

    switch (body.eventName) {
      case "document.signed":
        await handleDocumentSigned(c.env, body.eventData, c.req.url)
        break
      case "order.completed":
        await handleDocumentSigned2(c.env, body.eventData, c.req.url)
        break
      case "order.expired":
        console.log("Order expired:", body.eventData)
        break
      default:
        console.log(`Unhandled event type: ${body.eventName}`)
    }

    return c.json({ ok: true, message: "Webhook processed successfully" }, 200)
  } catch (error) {
    console.error("Error processing webhook:", error)
    return c.json(
      { ok: false, message: "Error processing webhook", error: String(error) },
      400,
    )
  }
})

async function handleDocumentSigned2(
  env: Env,
  eventData: any,
  requestUrl: string,
) {
  console.log("Starting handleDocumentSigned function")
  const { id: documentId, externalId } = eventData
  console.log(`Document ID: ${documentId}, External ID: ${externalId}`)

  try {
    // Retrieve the signed document
    console.log("Attempting to retrieve signed document")
    const accessToken = await getAccessToken(env)
    console.log("Access token obtained")

    // Construct the URL with query parameters
    const url = new URL(
      `https://api.signicat.com/express/sign/documents/${documentId}/files`,
    )
    // url.searchParams.append("fileFormat", "pades")
    // url.searchParams.append("originalFileName", "true")

    console.log(`Fetching document from URL: ${url.toString()}`)
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/pdf",
      },
    })

    if (!response.ok) {
      console.error(`Response status: ${response.status}`)
      console.error(`Response headers:`, Object.fromEntries(response.headers))
      const errorBody = await response.text()
      console.error(`Response body: ${errorBody}`)
      throw new Error(
        `Failed to retrieve signed document: ${response.statusText}`,
      )
    }

    console.log("Document retrieved successfully")
    const fileContent = await response.arrayBuffer()
    const contentType =
      response.headers.get("Content-Type") || "application/pdf"
    console.log(`Content-Type: ${contentType}`)

    // Store the file content in R2
    console.log("Attempting to store document in R2")
    const storageKey = await storeSignedDocument(
      env,
      documentId,
      fileContent,
      contentType,
    )

    console.log(`Document ${documentId} stored in R2 with key: ${storageKey}`)

    // Generate a proxy URL for the document
    const proxyUrl = getProxyUrl(requestUrl, documentId)
    console.log(`Generated proxy URL: ${proxyUrl}`)

    // Here you can add any additional processing, like updating your database
    // or sending notifications

    console.log("handleDocumentSigned function completed successfully")
  } catch (error) {
    console.error(
      `Error in handleDocumentSigned for document ${documentId}:`,
      error,
    )
    throw error
  }
}

async function handleDocumentSigned(
  env: Env,
  eventData: any,
  requestUrl: string,
) {
  const { documentId, externalId } = eventData

  // 1. Update document status in your database
  //   const document = await prisma(env).document.update({
  //     where: { externalId },
  //     data: { status: "SIGNED" },
  //   })

  // 2. Retrieve the signed document
  console.log("Attempting to retrieve signed document")
  const accessToken = await getAccessToken(env)
  console.log("Access token obtained")

  // Construct the URL with query parameters
  const url = new URL(
    `https://api.signicat.com/express/sign/documents/${documentId}/files`,
  )
  //   url.searchParams.append("fileFormat", "pades")
  //   url.searchParams.append("originalFileName", "true")

  console.log(`Fetching document from URL: ${url.toString()}`)
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/pdf",
    },
  })

  if (response.ok) {
    const fileContent = await response.arrayBuffer()
    const contentType =
      response.headers.get("Content-Type") || "application/pdf"

    // Store the file content in R2
    const storageKey = await storeSignedDocument(
      env,
      documentId,
      fileContent,
      contentType,
    )

    // Update the document record with the storage key
    // await prisma(env).document.update({
    //   where: { externalId },
    //   data: { storageKey },
    // })

    console.log(`Document ${documentId} stored in R2 with key: ${storageKey}`)

    // Generate a proxy URL for the document
    const proxyUrl = getProxyUrl(requestUrl, documentId)

    // 3. Fetch signers information
    // const signers = await prisma(env).documentSigner.findMany({
    //   where: { documentId: document.id },
    //   include: { user: true },
    // })

    // 4. Send notifications to relevant parties
    // for (const signer of signers) {
    // Assuming you have implemented the sendNotification function
    // await sendNotification(signer.user, {
    //   type: "DOCUMENT_SIGNED",
    //   documentId: document.id,
    //   documentTitle: document.title,
    //   downloadUrl: proxyUrl,
    // })
    // }

    // 5. Any additional business logic
    // For example, trigger a workflow, update related records, etc.
    // You can add more logic here as needed
  } else {
    console.error(`Failed to retrieve signed document: ${response.statusText}`)
    // Handle the error appropriately
  }
}

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

app.post("/test-document-storage", async (c) => {
  const env = c.env as Env

  try {
    // Use the dummy content (or real content in production)
    const dummyContent = "This is a test document"
    const documentId = "test-" + Date.now()
    const contentType = "text/plain"

    // Store the document in R2
    const key = await storeSignedDocument(
      env,
      documentId,
      new TextEncoder().encode(dummyContent),
      contentType,
    )

    // Generate a proxy URL that expires in 1 hour
    const proxyUrl = getProxyUrl(c.req.url, documentId)

    return c.json({
      success: true,
      message: "Document stored successfully",
      documentId: documentId,
      downloadUrl: proxyUrl,
    })
  } catch (error) {
    console.error("Error in document storage:", error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

app.get("/documents/:documentId", async (c) => {
  const env = c.env as Env
  const documentId = c.req.param("documentId")
  const key = `signed-documents/${documentId}`

  try {
    const object = await env.PROPDOCK_BINDING.get(key, {
      range: c.req.header("range"),
      onlyIf: c.req.header("if-none-match"),
    })

    if (object === null) {
      return c.json({ error: "Document not found" }, 404)
    }

    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set("etag", object.httpEtag)

    if (object.range) {
      headers.set(
        "content-range",
        `bytes ${object.range.offset}-${object.range.end ?? object.size - 1}/${object.size}`,
      )
    }

    const status = object.body
      ? c.req.header("range") !== null
        ? 206
        : 200
      : 304

    return new Response(object.body, {
      headers,
      status,
    })
  } catch (error) {
    console.error("Error retrieving document:", error)
    return c.json({ error: "Failed to retrieve document" }, 500)
  }
})

export const ESignApp = app
