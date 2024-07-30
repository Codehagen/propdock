"use client"

import React, { useEffect, useRef, useState } from "react"
import { usePDF } from "react-to-pdf"

import Editor from "@/components/editor/editor"

const TenantEditor = ({ contractContent }) => {
  const [value, setValue] = useState(contractContent)
  const [isExporting, setIsExporting] = useState(false)
  const pdfContentRef = useRef(null)

  const { toPDF, targetRef } = usePDF({
    filename: "document.pdf",
    method: "save",
    page: { format: "A4" },
    options: {
      margin: 20,
      fontSize: 12,
    },
  })

  useEffect(() => {
    if (pdfContentRef.current) {
      pdfContentRef.current.innerHTML = value
    }
  }, [value])

  const exportToPDF = async () => {
    setIsExporting(true)
    await toPDF()
    setIsExporting(false)
  }

  return (
    <div>
      <button onClick={exportToPDF} disabled={isExporting}>
        {isExporting ? "Exporting..." : "Export to PDF"}
      </button>
      <Editor
        content={value}
        onChange={setValue}
        placeholder="Write your post here..."
      />
      <div ref={targetRef} style={{ position: "absolute", left: "-9999px" }}>
        <div
          ref={pdfContentRef}
          className="prose max-w-none"
          style={{ width: "210mm", padding: "20mm" }}
        />
      </div>
    </div>
  )
}

export default TenantEditor
