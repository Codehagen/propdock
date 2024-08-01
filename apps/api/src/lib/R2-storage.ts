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

export async function getSignedDocument(
  env: Env,
  key: string,
): Promise<Response | null> {
  const bucket = env.PROPDOCK_BINDING

  if (!bucket) {
    throw new Error("R2 bucket is not configured")
  }

  const object = await bucket.get(key)

  if (!object) {
    return null
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set("etag", object.httpEtag)

  return new Response(object.body, {
    headers,
  })
}
