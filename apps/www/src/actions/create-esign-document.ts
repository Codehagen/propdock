"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import axios from "axios"

const api = axios.create({
  baseURL: 'https://api.propdock.workers.dev',
  headers: {
    'x-fe-key': 'super-secret'
  }
})


export async function createEsignDocument(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error("Not authenticated")
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const signers = JSON.parse(formData.get('signers') as string)
  const file = formData.get('file') as File
  const contactEmail = formData.get('contactEmail') || 'post@propdock.no'
  const smsText = formData.get('smsText') || "Vennligst signer dokumentet '{document-title}'. Du kan signere det her: {url}"

  // Convert file to base64
  const fileBuffer = await file.arrayBuffer()
  const base64Content = Buffer.from(fileBuffer).toString('base64')

  // Prepare the request body
  const requestBody = {
    title,
    description,
    base64Content,
    fileName: file.name,
    contactEmail,
    smsText,
    signers: signers.map((signer: any) => ({
      firstName: signer.name.split(' ')[0],
      lastName: signer.name.split(' ').slice(1).join(' '),
      email: signer.email,
      mobile: {
        countryCode: "+47", // Assuming Norwegian numbers
        number: signer.mobile || ""
      }
    }))
  }

  try {
    const response = await api.post('/api/internal/esign/create-document', requestBody)
    return response.data
  } catch (error) {
    console.error("Error creating e-sign document:", error)
    throw error
  }
}