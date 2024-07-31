import React from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import EditorToolbar from "./toolbar/editor-toolbar"

interface EditorProps {
  content: string
  placeholder?: string
  onChange: (value: string) => void
  hideToolbar?: boolean
}

export const Editor = ({
  content,
  placeholder,
  onChange,
  hideToolbar = false,
}: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return <></>

  return (
    <div className="prose w-full max-w-none rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      {!hideToolbar && <EditorToolbar editor={editor} />}
      <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  )
}

export default Editor
