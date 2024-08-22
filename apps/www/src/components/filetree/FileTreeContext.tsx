"use client"

import React, { createContext, useContext, useState } from "react"

import { TreeViewElement } from "./tree-view-api"

interface FileTreeContextType {
  fileTreeData: TreeViewElement[]
  deleteItem: (id: string) => void
  renameItem: (id: string, newName: string) => void
}

const FileTreeContext = createContext<FileTreeContextType | undefined>(
  undefined,
)

export const FileTreeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fileTreeData, setFileTreeData] = useState<TreeViewElement[]>([
    {
      id: "1",
      name: "Eiendom",
      children: [
        {
          id: "2",
          name: "fullmakt.pdf",
        },
        {
          id: "3",
          name: "Kontrakter",
          children: [
            {
              id: "20",
              name: "Eiendom 1",
              children: [
                {
                  id: "21",
                  name: "kontrakt.pdf",
                },
              ],
            },
          ],
        },
        {
          id: "6",
          name: "Økonomi",
          children: [
            {
              id: "7",
              name: "budsjett.excel",
            },
          ],
        },
      ],
    },
  ])

  const deleteItem = (id: string) => {
    const deleteRecursive = (items: TreeViewElement[]): TreeViewElement[] => {
      return items.filter((item) => {
        if (item.id === id) return false
        if (item.children) {
          item.children = deleteRecursive(item.children)
        }
        return true
      })
    }
    setFileTreeData(deleteRecursive(fileTreeData))
  }

  const renameItem = (id: string, newName: string) => {
    const renameRecursive = (items: TreeViewElement[]): TreeViewElement[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, name: newName }
        }
        if (item.children) {
          return { ...item, children: renameRecursive(item.children) }
        }
        return item
      })
    }
    setFileTreeData(renameRecursive(fileTreeData))
  }

  return (
    <FileTreeContext.Provider value={{ fileTreeData, deleteItem, renameItem }}>
      {children}
    </FileTreeContext.Provider>
  )
}

export const useFileTree = () => {
  const context = useContext(FileTreeContext)
  if (context === undefined) {
    throw new Error("useFileTree must be used within a FileTreeProvider")
  }
  return context
}
