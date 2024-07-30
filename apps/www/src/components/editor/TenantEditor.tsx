"use client"

import React, { useRef, useState } from "react"
import { usePDF } from "react-to-pdf"

import Editor from "@/components/editor/editor"

const TenantEditor = ({ contractContent }) => {
  const [value, setValue] = useState(contractContent)
  const [isExporting, setIsExporting] = useState(false)
  const editorRef = useRef(null)

  const { toPDF, targetRef } = usePDF({
    filename: "document.pdf",
    method: "save",
  })

  const exportToPDF = async () => {
    setIsExporting(true)
    toPDF()
    setIsExporting(false)
  }

  return (
    <div>
      <button onClick={exportToPDF}>Export to PDF</button>
      <div ref={targetRef}>
        <Editor
          content={value}
          onChange={setValue}
          placeholder="Write your post here..."
          hideToolbar={isExporting}
        />
      </div>
    </div>
  )
}

export default TenantEditor
