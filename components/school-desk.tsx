"use client";

import { useEffect } from "react";
import { startSchool } from "@/school/boot";

export function SchoolDesk({ html }: { html: string }) {
  useEffect(() => {
    startSchool();
  }, []);

  return (
    <div
      className="flex h-full overflow-hidden font-sans text-slate-800 antialiased"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
