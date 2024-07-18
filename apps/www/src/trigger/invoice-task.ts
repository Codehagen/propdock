// /trigger/invoice-task.ts
import { task, wait } from "@trigger.dev/sdk/v3"
import { addDays, addMonths } from "date-fns"

interface InvoicePayload {
  customer: string
  email: string
  accountNumber: string
  comment: string
  orderReference: string
  ourReference: string
  theirReference: string
  invoiceEmail: string
  product: string
  price: number
  quantity: number
  dueDate: Date
  date: Date
  isRecurring: boolean
  recurringInterval: string // new field for recurring interval
}

const calculateNextRunDate = (currentDate: Date, interval: string): Date => {
  switch (interval) {
    case "monthly":
      return addMonths(currentDate, 1)
    case "biweekly":
      return addDays(currentDate, 14)
    case "quarterly":
      return addMonths(currentDate, 3)
    case "semiannually":
      return addMonths(currentDate, 6)
    case "annually":
      return addMonths(currentDate, 12)
    default:
      throw new Error("Invalid interval")
  }
}

export const invoiceTask = task({
  id: "invoice-task",
  run: async (payload: InvoicePayload) => {
    // Logic for recurring invoices can go here
    if (payload.isRecurring) {
      const nextRunDate = calculateNextRunDate(
        new Date(),
        payload.recurringInterval,
      )
      const delayInMilliseconds = nextRunDate.getTime() - new Date().getTime()

      // Wait until the next run date
      await wait.for({ seconds: delayInMilliseconds })

      // Check if the task is still recurring before re-triggering
      if (payload.isRecurring) {
        await invoiceTask.trigger(payload)
      }
    }
  },
})
