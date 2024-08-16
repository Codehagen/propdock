import { z } from "zod"

export const signingSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  propertyId: z.string(),
  downloadUrl: z.string().url(),
  signedAt: z.string().date().optional(),
  createdAt: z.string().date(),
  updatedAt: z.string().date().optional(),
})

export type SignSchema = z.infer<typeof signingSchema>
