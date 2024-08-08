import { User } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

import { Env } from "@/env"
import { honoFactory } from "@/lib/hono"
import {
  createDocumentInDatabase,
  getAccessToken,
  getProxyUrl,
  handleDocumentCompletedSigned,
  handleDocumentSigned,
  storeSignedDocument,
} from "@/lib/R2-storage"
import { ESigningClient } from "@/lib/signicat"

const app = honoFactory()

// Base64 encoded PDF content (you'll need to generate this beforehand)
const pdfBase64 =
  "JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDEgMCBSIC9MYXN0TW9kaWZpZWQgKEQ6MjAyMzA1MTYxMjM0NTYpCi9SZXNvdXJjZXMgMiAwIFIgL01lZGlhQm94IFswIDAgNTk1LjI3NiA4NDEuODldIC9Db250ZW50cyA2IDAgUiA+PgplbmRvYmoKNiAwIG9iago8PCAvRmlsdGVyIC9GbGF0ZURlY29kZSAvTGVuZ3RoIDY2ID4+CnN0cmVhbQp4nDPUM1Qw1DNU0C/OLMrMSy9KTFEoycgsVshNzMxTKEktLlEoLskvUCjPL8pJUQQKFGeUFni4BLo5+rs6Kxi5mBq5mBkCAKZPEZEKZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbIDUgMCBSIF0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDEgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9Qcm9kdWNlciAoU2ltdWxhdGVkIFBERikgL0NyZWF0aW9uRGF0ZSAoRDoyMDIzMDUxNjEyMzQ1NikgPj4KZW5kb2JqCjIgMCBvYmoKPDwgPj4KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDM2MyAwMDAwMCBuIAowMDAwMDAwNjE3IDAwMDAwIG4gCjAwMDAwMDA0MjIgMDAwMDAgbiAKMDAwMDAwMDQ3MSAwMDAwMCBuIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAyMjIgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA3IC9Sb290IDMgMCBSIC9JbmZvIDQgMCBSID4+CnN0YXJ0eHJlZgo2MzcKJSVFT0YK"

app.post("/create-document", async (c) => {
  const env = c.env as Env
  const user: User = c.get("user")!
  console.log(
    "Debug: User from context",
    user ? { id: user.id, email: user.email } : "undefined",
  )

  if (!user) {
    console.warn("Debug: User not found in context")
    return c.json({ ok: false, message: "User not authenticated" }, 401)
  }

  try {
    const accessToken = await getAccessToken(env)
    console.log("Debug: Access token obtained")

    const body = await c.req.json()
    console.log("Debug: Request body", {
      title: body.title,
      description: body.description,
      "signers.length": body.signers.length,
      "base64Content.length": body.base64Content.length,
    })

    const documentData = {
      title: body.title,
      description: body.description,
      externalId: uuidv4(),
      dataToSign: {
        base64Content: body.base64Content || pdfBase64,
        fileName: "document.pdf",
      },
      contactDetails: {
        email: body.contactEmail || "post@propdock.no",
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

    console.log("Debug: Document data prepared", {
      title: documentData.title,
      description: documentData.description,
      externalId: documentData.externalId,
      "dataToSign.fileName": documentData.dataToSign.fileName,
      "signers.length": documentData.signers.length,
    })

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
      const errorText = await response.text()
      console.error("Debug: Signicat API error", {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
      })
      throw new Error(`Failed to create document: ${response.statusText}`)
    }

    const createdDocument = await response.json()
    console.log("Debug: Created document", {
      id: createdDocument.id,
      status: createdDocument.status,
    })

    await createDocumentInDatabase(env, documentData, createdDocument, user)
    console.log("Debug: Document created in database")

    return c.json({
      ok: true,
      message: "Document created successfully",
      document: {
        id: createdDocument.id,
        status: createdDocument.status,
      },
    })
  } catch (error) {
    console.error("Failed to create document:", error.message)
    return c.json(
      { ok: false, message: "Failed to create document", error: error.message },
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
      case "order.completed":
        await handleDocumentCompletedSigned(c.env, body.eventData, c.req.url)
        break
      case "recipient.completed":
        // await handleRecipientSigned(c.env, body.eventData, c.req.url)
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
