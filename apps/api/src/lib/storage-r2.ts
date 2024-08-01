import { R2Bucket } from "@cloudflare/workers-types"

// Declare the R2 bucket as a global variable
declare global {
  const PROPDOCK_BINDING: R2Bucket
}

export async function storeSignedDocument(
  documentId: string,
  fileContent: ArrayBuffer,
  contentType: string,
) {
  try {
    const key = `signed-documents/${documentId}`
    await PROPDOCK_BINDING.put(key, fileContent, {
      httpMetadata: {
        contentType: contentType,
      },
    })
    console.log(`Document ${documentId} stored in R2`)
    return key
  } catch (error) {
    console.error(`Failed to store document ${documentId} in R2:`, error)
    throw error
  }
}
