import { User } from "@prisma/client"

import { Env } from "@/env"
import { prisma } from "@/lib/db"

export async function storeSignedDocument(
  env: Env,
  documentId: string,
  content: ArrayBuffer | Buffer,
  contentType: string,
): Promise<string> {
  const bucket = env.PROPDOCK_BINDING

  if (!bucket) {
    throw new Error("R2 bucket is not configured")
  }

  const key = `signed-documents/${documentId}`

  await bucket.put(key, content, {
    httpMetadata: { contentType },
  })

  return key
}

export function getProxyUrl(requestUrl: string, documentId: string): string {
  const url = new URL(requestUrl)
  return `${url.origin}/api/internal/esign/documents/${documentId}`
}

export async function getAccessToken(env: Env): Promise<string> {
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

export async function handleDocumentSigned(
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

export async function handleDocumentCompletedSigned(
  env: Env,
  eventData: any,
  requestUrl: string,
) {
  console.log("Starting handleDocumentCompletedSigned function")
  const { id: documentId } = eventData
  console.log(`Document ID: ${documentId}`)

  try {
    // Retrieve the access token
    const accessToken = await getAccessToken(env)
    console.log("Access token obtained")

    // Fetch the document summary
    const summaryUrl = `https://api.signicat.com/express/sign/documents/${documentId}/summary`
    const summaryResponse = await fetch(summaryUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!summaryResponse.ok) {
      throw new Error(
        `Failed to retrieve document summary: ${summaryResponse.statusText}`,
      )
    }

    const summary = await summaryResponse.json()
    console.log("Document summary retrieved successfully")

    // Fetch the signed document
    const fileUrl = `https://api.signicat.com/express/sign/documents/${documentId}/files`
    const fileResponse = await fetch(fileUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/pdf",
      },
    })

    if (!fileResponse.ok) {
      throw new Error(
        `Failed to retrieve signed document: ${fileResponse.statusText}`,
      )
    }

    const fileContent = await fileResponse.arrayBuffer()
    const contentType =
      fileResponse.headers.get("Content-Type") || "application/pdf"

    // Store the file content in R2
    const storageKey = await storeSignedDocument(
      env,
      documentId,
      fileContent,
      contentType,
    )

    console.log(`Document ${documentId} stored in R2 with key: ${storageKey}`)

    // Generate a proxy URL for the document
    const proxyUrl = getProxyUrl(requestUrl, documentId)

    // Update the document in the database
    await prisma(env).document.update({
      where: { externalId: documentId },
      data: {
        status: (summary as any).status.documentStatus,
        storageKey,
        contentType,
        signedAt: new Date((summary as any).lastUpdated),
        signers: (summary as any).documentSignatures,
        downloadUrl: proxyUrl,
      },
    })

    console.log("Document updated in the database")

    // Here you can add any additional processing, like sending notifications

    console.log("handleDocumentCompletedSigned function completed successfully")
  } catch (error) {
    console.error(
      `Error in handleDocumentSigned for document ${documentId}:`,
      error,
    )
    throw error
  }
}

export async function createDocumentInDatabase(
  env: Env,
  documentData: any,
  createdDocument: any,
  user: User,
): Promise<void> {
  console.log("Debug: Entering createDocumentInDatabase")
  console.log("Debug: documentData", JSON.stringify(documentData, null, 2))
  console.log(
    "Debug: createdDocument",
    JSON.stringify(createdDocument, null, 2),
  )
  console.log("Debug: user", JSON.stringify(user, null, 2))

  try {
    console.log("Debug: Attempting to create document")
    await prisma(env).document.create({
      data: {
        externalId: createdDocument.documentId,
        title: documentData.title,
        description: documentData.description,
        status: createdDocument.status.documentStatus,
        signers: createdDocument.signers,
        userId: user.id,
        workspaceId: user.workspaceId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    console.log("Debug: Document created successfully")
  } catch (error) {
    console.error("Debug: Error in createDocumentInDatabase", error)
    throw error
  }
}
