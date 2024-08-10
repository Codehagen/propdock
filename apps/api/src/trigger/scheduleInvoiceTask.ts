import { logger, schedules, task, wait } from "@trigger.dev/sdk/v3"

export const scheduleInvoiceTask = schedules.task({
  id: "schedule-invoice-task",
  run: async (payload, { ctx }) => {
    logger.log("Processing scheduled invoice", { payload, ctx })

    // Extract invoice details from the payload.data
    // We're assuming the invoice data is passed in the `data` field of the event
    const {
      invoiceId,
      customer,
      email,
      ourReference,
      theirReference,
      orderReference,
      product,
      quantity,
      price,
      invoiceEmail,
      date,
      dueDate,
      accountNumber,
      comment,
      totalPrice,
      vat,
      totalPriceWithVat,
    } = payload.data || {}

    // Log the invoice details
    logger.log("Invoice details", {
      invoiceId,
      customer,
      email,
      ourReference,
      theirReference,
      orderReference,
      product,
      quantity,
      price,
      invoiceEmail,
      date,
      dueDate,
      accountNumber,
      comment,
      totalPrice,
      vat,
      totalPriceWithVat,
    })

    // Simulate some processing time
    await wait.for({ seconds: 2 })

    // Here you would typically integrate with your invoice sending system
    // For now, we'll just log that the invoice is being processed
    logger.log("Processing invoice for sending", { invoiceId, date, dueDate })

    // Simulate sending the invoice
    await wait.for({ seconds: 3 })

    logger.log("Invoice sent successfully", { invoiceId, date, dueDate })

    return {
      message: "Invoice processed and sent successfully",
      invoiceId,
      customer,
      email,
      date,
      dueDate,
      totalPriceWithVat,
    }
  },
})

// We'll keep the daily schedule, but you might want to adjust this based on your needs
schedules.create({
  task: scheduleInvoiceTask.id,
  cron: "0 9 * * *", // Run every day at 9 AM
  timezone: "UTC",
  deduplicationKey: "daily-invoice-processor",
})
