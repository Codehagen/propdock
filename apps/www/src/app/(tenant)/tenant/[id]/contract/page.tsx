"use client";

import React, { useState } from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import Editor from "@/components/editor/editor";

export default function Home() {
  const [value, setValue] = useState("Hello World! 🌎️");

  return (
    <div>
      <DashboardShell>
        <DashboardHeader
          heading="Kontrakter"
          text="Skriv kontrakt for din leietaker."
        />
        <Editor
          content={value}
          onChange={setValue}
          placeholder="Write your post here..."
        />
        {/* <Tiptap /> */}
      </DashboardShell>
    </div>
  );
}
