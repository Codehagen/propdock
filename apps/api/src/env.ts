/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { z } from "zod"

export const zEnv = z.object({
  DATABASE_URL: z.string(),
  ENVIRONMENT: z
    .enum(["development", "preview", "production"])
    .default("development"),
  PO_ROOT: z.string(),
  PO_SUB_KEY: z.string(),
  PO_APP_KEY: z.string(),
  PO_ONBOARD_REDIRECT: z.string(),
  SIGNICAT_CLIENT_ID: z.string(),
  SIGNICAT_CLIENT_SECRET: z.string(),
  SIGNICAT_ACCOUNT_ID: z.string(),
})

export type Env = z.infer<typeof zEnv>
