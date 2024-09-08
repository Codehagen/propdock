"use client";

import { Button } from "@propdock/ui/components/button";
import { FileDown, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { usePDF } from "react-to-pdf";

import Editor from "@/components/editor/editor";

const TenantEditor = ({ contractContent }) => {
  const [value, setValue] = useState(contractContent);
  const [isExporting, setIsExporting] = useState(false);
  const pdfContentRef = useRef(null);

  const tenantName =
    contractContent.match(/2\.1 Navn\/Firma: (.*?) \(Leietaker\)/)?.[1] ||
    "Leieavtale";

  const { toPDF, targetRef } = usePDF({
    filename: `${tenantName.replace(/\s+/g, "_")}_kontrakt.pdf`,
    method: "save",
    page: { format: "A4" }
  });

  useEffect(() => {
    if (pdfContentRef.current) {
      pdfContentRef.current.innerHTML = value;
    }
  }, [value]);

  const exportToPDF = async () => {
    setIsExporting(true);
    await toPDF();
    setIsExporting(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={exportToPDF} disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Lager PDF...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Last ned PDF
            </>
          )}
        </Button>
      </div>
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
  );
};

export default TenantEditor;
