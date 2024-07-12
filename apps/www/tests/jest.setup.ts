import { prisma } from "./__mocks__/prisma"

// Mock the prisma instance in the db file
jest.mock("@/lib/db", () => ({
  prisma: prisma,
}))
