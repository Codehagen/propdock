import { Env } from "@/env"

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
