"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FileTextIcon, ImageIcon, OctagonXIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Progress, ProgressLabel, ProgressTrack, ProgressValue } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast, Toaster } from "@/components/ui/toast";

type UploadState = "idle" | "uploading" | "processing" | "error" | "done";

export type DeskFile = {
  id: string;
  name: string;
  size: string;
  state?: UploadState;
  progress?: number;
  error?: string;
  preview?: string;
};

type EmptySlot = {
  id: string;
  title: string;
  description: string;
  actions: string;
};

type AlertSlot = {
  id: string;
  title: string;
  description: string;
  variant: "default" | "destructive";
};

type Surfaces = {
  files: DeskFile[] | null;
  logo: DeskFile | null;
  chatPending: boolean;
  empties: EmptySlot[];
};

type ToastDetail = {
  id?: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning" | "loading";
  timeout?: number;
};

declare global {
  interface Window {
    __deskSurfaces?: Surfaces;
    __deskButtons?: string[];
    __deskAlerts?: AlertSlot[];
  }
}

const blankSurfaces: Surfaces = {
  files: null,
  logo: null,
  chatPending: false,
  empties: [],
};

function host(id: string | null | undefined) {
  if (!id || typeof document === "undefined") return null;
  return document.getElementById(id);
}

function FileCard({ file }: { file: DeskFile }) {
  const state = file.state || "done";
  const busy = state === "uploading" || state === "processing";
  const description = state === "error"
    ? file.error || "Upload failed"
    : state === "uploading"
      ? "Uploading"
      : state === "processing"
        ? "Finishing"
        : state === "done"
          ? file.size + " · Uploaded"
          : file.size;

  return (
    <div className="flex w-full flex-col gap-2">
      <Attachment state={state} size="sm" className="w-full">
        <AttachmentMedia variant={file.preview && state === "done" ? "image" : "icon"}>
          {busy ? <Spinner /> : null}
          {!busy && file.preview && state === "done" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={file.preview} alt="" />
          ) : null}
          {!busy && !(file.preview && state === "done") ? (
            state === "error" ? <OctagonXIcon /> : file.preview ? <ImageIcon /> : <FileTextIcon />
          ) : null}
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{file.name}</AttachmentTitle>
          <AttachmentDescription>{description}</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      {busy ? (
        <Progress value={file.progress ?? 0}>
          <ProgressLabel className="sr-only">Upload progress</ProgressLabel>
          <ProgressTrack />
          <ProgressValue />
        </Progress>
      ) : null}
    </div>
  );
}

function FileList({ files }: { files: DeskFile[] }) {
  if (!files.length) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileTextIcon />
          </EmptyMedia>
          <EmptyTitle>No documents yet</EmptyTitle>
          <EmptyDescription>Upload a transcript or report. It stays on this campus list.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {files.map((file) => (
        <FileCard key={file.id || file.name} file={file} />
      ))}
    </div>
  );
}

function LogoStatus({ upload }: { upload: DeskFile }) {
  return (
    <div className="mt-3 flex flex-col gap-3">
      {upload.state === "error" ? (
        <Alert variant="destructive">
          <OctagonXIcon />
          <AlertTitle>Logo was not saved</AlertTitle>
          <AlertDescription>{upload.error || "Choose a smaller image and try again."}</AlertDescription>
        </Alert>
      ) : null}
      <FileCard file={upload} />
    </div>
  );
}

function EmptyState({ slot }: { slot: EmptySlot }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileTextIcon />
        </EmptyMedia>
        <EmptyTitle>{slot.title}</EmptyTitle>
        {slot.description ? <EmptyDescription>{slot.description}</EmptyDescription> : null}
      </EmptyHeader>
      {slot.actions === "records" ? (
        <EmptyContent className="flex-row flex-wrap justify-center">
          <Button type="button" size="sm" data-action="record-add">Create the first record</Button>
          <Button type="button" size="sm" variant="outline" data-action="record-import">Import</Button>
          <Button type="button" size="sm" variant="outline" data-action="record-export">Export</Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}

function Notice({ alert }: { alert: AlertSlot }) {
  return (
    <Alert variant={alert.variant}>
      {alert.variant === "destructive" ? <OctagonXIcon /> : null}
      <AlertTitle>{alert.title}</AlertTitle>
      <AlertDescription>{alert.description}</AlertDescription>
    </Alert>
  );
}

export function DeskFeedback() {
  const [mounted, setMounted] = useState(false);
  const [surfaces, setSurfaces] = useState<Surfaces>(blankSurfaces);
  const [buttons, setButtons] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<AlertSlot[]>([]);

  useEffect(() => {
    setMounted(true);

    function onToast(event: Event) {
      const detail = (event as CustomEvent<ToastDetail>).detail;
      if (!detail?.title) return;
      toast.add({
        id: detail.id,
        title: detail.title,
        description: detail.description,
        type: detail.type,
        timeout: detail.type === "loading" ? 0 : detail.timeout ?? 3200,
      });
    }

    function onSurfaces(event: Event) {
      setSurfaces((event as CustomEvent<Surfaces>).detail || blankSurfaces);
    }

    function onButtons() {
      setButtons([...(window.__deskButtons || [])]);
    }

    function onAlert(event: Event) {
      const detail = (event as CustomEvent<AlertSlot & { clear?: boolean }>).detail;
      if (!detail?.id) return;
      setAlerts((current) => {
        const next = current.filter((item) => item.id !== detail.id);
        if (!detail.clear && detail.title) next.push(detail);
        window.__deskAlerts = next;
        return next;
      });
    }

    if (window.__deskSurfaces) setSurfaces(window.__deskSurfaces);
    if (window.__deskButtons) setButtons([...window.__deskButtons]);
    if (window.__deskAlerts) setAlerts([...window.__deskAlerts]);

    window.addEventListener("desk:toast", onToast);
    window.addEventListener("desk:surfaces", onSurfaces);
    window.addEventListener("desk:button", onButtons);
    window.addEventListener("desk:alert", onAlert);
    return () => {
      window.removeEventListener("desk:toast", onToast);
      window.removeEventListener("desk:surfaces", onSurfaces);
      window.removeEventListener("desk:button", onButtons);
      window.removeEventListener("desk:alert", onAlert);
    };
  }, []);

  const fileHost = mounted && surfaces.files ? host("transcript-files") : null;
  const logoHost = mounted && surfaces.logo ? host("logo-upload") : null;
  const chatHost = mounted && surfaces.chatPending ? host("chat-pending") : null;

  return (
    <>
      <Toaster timeout={3200} />
      {fileHost ? createPortal(<FileList files={surfaces.files || []} />, fileHost) : null}
      {logoHost && surfaces.logo ? createPortal(<LogoStatus upload={surfaces.logo} />, logoHost) : null}
      {chatHost
        ? createPortal(
            <>
              <Spinner />
              <span className="grid gap-1.5">
                <Skeleton className="h-2 w-40" />
                <Skeleton className="h-2 w-24" />
              </span>
            </>,
            chatHost,
          )
        : null}
      {mounted
        ? surfaces.empties.map((slot) => {
            const node = host(slot.id);
            return node ? createPortal(<EmptyState slot={slot} />, node, slot.id) : null;
          })
        : null}
      {mounted
        ? alerts.map((alert) => {
            const node = host(alert.id);
            return node ? createPortal(<Notice alert={alert} />, node, alert.id) : null;
          })
        : null}
      {mounted
        ? buttons.map((id) => {
            const node = host(id);
            return node ? createPortal(<Spinner className="size-4 text-white" />, node, id) : null;
          })
        : null}
    </>
  );
}
