/// <reference types="jest" />

import { PrismaClient } from "@prisma/client"
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended"

export const prisma = mockDeep<PrismaClient>()

beforeEach(() => {
  mockReset(prisma)
})
