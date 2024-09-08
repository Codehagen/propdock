"use server";

import axios from "axios";

import { getCurrentUser } from "@/lib/session";

const api = axios.create({
  baseURL: "https://api.propdock.workers.dev"
});

api.interceptors.request.use(async config => {
  const user = await getCurrentUser();
  config.headers["x-fe-key"] = "super-secret";
  if (user?.id) {
    config.headers["x-user-id"] = user.id;
  }
  return config;
});

export async function createEsignDocument(formData: FormData) {
  console.log("createEsignDocument - Received FormData:", {
    title: formData.get("title"),
    description: formData.get("description"),
    signers: JSON.parse(formData.get("signers") as string),
    "file.name": (formData.get("file") as File).name,
    "file.size": (formData.get("file") as File).size
  });

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const signers = JSON.parse(formData.get("signers") as string);
  const file = formData.get("file") as File;
  const contactEmail = formData.get("contactEmail") || "post@propdock.no";
  const smsText =
    formData.get("smsText") ||
    "Vennligst signer dokumentet '{document-title}'. Du kan signere det her: {url}";

  // Convert file to base64
  const fileBuffer = await file.arrayBuffer();
  const base64Content = Buffer.from(fileBuffer).toString("base64");

  // Prepare the request body
  const requestBody = {
    title,
    description,
    base64Content,
    fileName: file.name,
    contactEmail,
    smsText,
    signers: signers.map((signer: any) => ({
      firstName: signer.name.split(" ")[0],
      lastName: signer.name.split(" ").slice(1).join(" "),
      email: signer.email,
      mobile: {
        countryCode: "+47", // Assuming Norwegian numbers
        number: signer.mobile || "99444866"
      }
    }))
  };

  console.log("createEsignDocument - Prepared request body:", {
    title: requestBody.title,
    description: requestBody.description,
    fileName: requestBody.fileName,
    contactEmail: requestBody.contactEmail,
    signers: requestBody.signers,
    "base64Content.length": requestBody.base64Content.length
  });

  try {
    const response = await api.post(
      "/api/internal/esign/create-document",
      requestBody
    );
    console.log("createEsignDocument - API response:", {
      status: response.status,
      data: response.data
    });
    return response.data;
  } catch (error) {
    console.error("Error creating e-sign document:", error.message);
    if (error.response) {
      console.error("API error response:", {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw error;
  }
}
