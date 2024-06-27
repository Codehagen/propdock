"use client"

import React, { useState } from "react"

import Editor from "@/components/editor/editor"

const TenantEditor = ({ contractContent }) => {
  const [value, setValue] = useState(contractContent)

  return (
    <div>
      <Editor
        content={value}
        onChange={setValue}
        placeholder="Write your post here..."
      />
      {/* <Tiptap /> */}
    </div>
  )
}

export default TenantEditor
