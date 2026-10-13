"use client";

import { useEffect, useState } from "react";
import { startSchool } from "@/school/boot";
import { DeskFeedback } from "@/components/desk-feedback";
import { Spinner } from "@/components/ui/spinner";

export function Desk({ html }: { html: string }) {
  const [ready, setReady] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const slow = window.setTimeout(() => setShowLoader(true), 180);
    startSchool().finally(() => {
      window.clearTimeout(slow);
      setShowLoader(false);
      setReady(true);
    });
  }, []);

  return (
    <div className="relative h-full">
      <div
        className="flex h-full overflow-hidden font-sans text-slate-800 antialiased"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {showLoader && !ready ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/75">
          <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm text-card-foreground shadow-sm">
            <Spinner />
            Opening the campus desk
          </div>
        </div>
      ) : null}
      <DeskFeedback />
    </div>
  );
}
