"use client"

import React, { useState } from "react"

import { triggerInvoice } from "../../actions/triggers/create-recurring-invoice"

export default function CreateInvoiceComponent() {
  const [invoiceId, setInvoiceId] = useState("")
  const [amount, setAmount] = useState(0)
  const [isRecurring, setIsRecurring] = useState(false)

  const handleSubmit = async () => {
    const handle = await triggerInvoice(invoiceId, amount, isRecurring)
    console.log("Task handle:", handle)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Create Invoice</h1>
      <input
        type="text"
        placeholder="Invoice ID"
        value={invoiceId}
        onChange={(e) => setInvoiceId(e.target.value)}
        className="mb-2 rounded border p-2"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="mb-2 rounded border p-2"
      />
      <label className="mb-2">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="mr-2"
        />
        Recurring
      </label>
      <button
        onClick={handleSubmit}
        className="rounded bg-blue-500 p-2 text-white"
      >
        Submit
      </button>
    </main>
  )
}
