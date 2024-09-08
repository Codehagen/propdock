"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@propdock/ui/components/context-menu";
import { Input } from "@propdock/ui/components/input";
import type React from "react";
import { useState } from "react";

import { FileTreeProvider, useFileTree } from "./FileTreeContext";
import {
  CollapseButton,
  File,
  Folder,
  Tree,
  type TreeViewElement
} from "./tree-view-api";

const TOC = () => {
  const { fileTreeData } = useFileTree();

  return (
    <Tree
      className="h-60 w-full rounded-md bg-background p-2"
      initialSelectedId="21"
      elements={fileTreeData}
    >
      <TreeItem elements={fileTreeData} />
      <CollapseButton elements={fileTreeData} />
    </Tree>
  );
};

const TreeItem: React.FC<{ elements: TreeViewElement[] }> = ({ elements }) => {
  const { deleteItem, renameItem } = useFileTree();
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const handleRename = (id: string) => {
    setIsRenaming(id);
    setNewName(elements.find(e => e.id === id)?.name || "");
  };

  const submitRename = (id: string) => {
    renameItem(id, newName);
    setIsRenaming(null);
  };

  return (
    <>
      {elements.map(element => (
        <ContextMenu key={element.id}>
          <ContextMenuTrigger>
            {element.children && element.children.length > 0 ? (
              <Folder element={element.name} value={element.id}>
                <TreeItem elements={element.children} />
              </Folder>
            ) : (
              <File value={element.id}>
                {isRenaming === element.id ? (
                  <Input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onBlur={() => submitRename(element.id)}
                    onKeyDown={e =>
                      e.key === "Enter" && submitRename(element.id)
                    }
                    className="h-6 px-1 py-0"
                  />
                ) : (
                  <p>{element.name}</p>
                )}
              </File>
            )}
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onSelect={() => handleRename(element.id)}>
              Rename
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => deleteItem(element.id)}>
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </>
  );
};

const TOCWrapper = () => {
  return (
    <FileTreeProvider>
      <TOC />
    </FileTreeProvider>
  );
};

export default TOCWrapper;
