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

export async function getSignedDocument(key: string) {
  try {
    const object = await PROPDOCK_BINDING.get(key)
    if (object === null) {
      throw new Error("Document not found")
    }
    return object
  } catch (error) {
    console.error(`Failed to retrieve document with key ${key} from R2:`, error)
    throw error
  }
}
